import { useEffect, useRef } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native';

import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';

interface Props {
  items: number[];
  value: number;
  suffix?: string;
  itemHeight: number;
  pickerHeight: number;
  onChange: (value: number) => void;
}

export function WheelPicker({ items, value, suffix, itemHeight, pickerHeight, onChange }: Props) {
  const colors = useThemeColor();
  const listRef = useRef<FlatList<number>>(null);
  const dragEndTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedIndex = Math.max(
    items.findIndex((it) => it === value),
    0,
  );
  const verticalPadding = (pickerHeight - itemHeight) / 2;
  const valueWidth = Math.max(...items.map((item) => String(item).length)) * 20;
  const suffixWidth = suffix ? 20 : 0;
  const contentWidth = valueWidth + suffixWidth + (suffix ? 4 : 0);

  useEffect(() => {
    const offset = selectedIndex * itemHeight;

    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset, animated: false });
    });
  }, [itemHeight, selectedIndex]);

  useEffect(() => {
    return () => {
      if (dragEndTimeoutRef.current) {
        clearTimeout(dragEndTimeoutRef.current);
      }
    };
  }, []);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.min(
      Math.max(Math.round(event.nativeEvent.contentOffset.y / itemHeight), 0),
      items.length - 1,
    );
    const nextItem = items[nextIndex];

    if (nextItem != null && nextItem !== value) {
      onChange(nextItem);
    }
  };

  const handleScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (dragEndTimeoutRef.current) {
      clearTimeout(dragEndTimeoutRef.current);
    }

    // If momentum starts, this pending commit is canceled and only the final resting item is applied.
    dragEndTimeoutRef.current = setTimeout(() => {
      handleScrollEnd(event);
      dragEndTimeoutRef.current = null;
    }, 80);
  };

  const handleMomentumScrollBegin = () => {
    if (dragEndTimeoutRef.current) {
      clearTimeout(dragEndTimeoutRef.current);
      dragEndTimeoutRef.current = null;
    }
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (dragEndTimeoutRef.current) {
      clearTimeout(dragEndTimeoutRef.current);
      dragEndTimeoutRef.current = null;
    }

    handleScrollEnd(event);
  };

  return (
    <View style={[styles.container, { height: pickerHeight }]}>
      {suffix ? (
        <View
          pointerEvents="none"
          style={[
            styles.suffixOverlay,
            {
              top: verticalPadding,
              height: itemHeight,
              width: contentWidth,
            },
          ]}>
          <View style={styles.overlayContent}>
            <View style={{ width: valueWidth }} />
            <MDText style={styles.suffix} type="bodyRegular" color={colors.text.normal}>
              {suffix}
            </MDText>
          </View>
        </View>
      ) : null}

      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(item) => String(item)}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        contentContainerStyle={{ paddingVertical: verticalPadding }}
        onMomentumScrollBegin={handleMomentumScrollBegin}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollEndDrag={handleScrollEndDrag}
        renderItem={({ item }) => {
          const isSelected = item === value;

          return (
            <View style={[styles.item, { height: itemHeight, width: contentWidth }]}>
              <MDText
                style={[styles.value, { width: valueWidth }]}
                type={isSelected ? 'bodySemiBold' : 'bodyRegular'}
                color={isSelected ? colors.text.normal : colors.text.alternative}>
                {item}
              </MDText>
              {suffix ? (
                <MDText
                  style={[styles.suffix, styles.placeholderSuffix]}
                  type="bodyRegular"
                  color={colors.text.normal}>
                  {suffix}
                </MDText>
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  list: {
    flex: 1,
    width: '100%',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suffixOverlay: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  value: {
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  suffix: {
    marginLeft: 4,
  },
  placeholderSuffix: {
    opacity: 0,
  },
});
