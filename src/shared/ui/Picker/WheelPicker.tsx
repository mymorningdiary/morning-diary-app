import { useEffect, useRef } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native';

import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';

interface Props {
  items: any[];
  value: any;
  suffix?: string;
  itemHeight: number;
  pickerHeight: number;
  onChange: (value: number) => void;
}

export function WheelPicker({ items, value, suffix, itemHeight, pickerHeight, onChange }: Props) {
  const colors = useThemeColor();
  const styles = PickerStyles;
  const listRef = useRef<FlatList<number>>(null);
  const dragEndTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const verticalPadding = (pickerHeight - itemHeight) / 2;
  const valueWidth = Math.max(...items.map((item) => String(item).length)) * 12;
  const itemWidth = valueWidth + (suffix ? 4 : 0);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // contentOffset.y를 itemHeight로 나눠서 가장 가까운 인덱스를 계산
    const nextIndex = Math.min(
      Math.max(Math.round(event.nativeEvent.contentOffset.y / itemHeight), 0),
      items.length - 1,
    );
    const nextItem = items[nextIndex];

    if (nextItem != null && nextItem !== value) {
      onChange(nextItem);
    }
  };

  // 손가락을 땠을 때 호출
  const handleScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (dragEndTimeoutRef.current) {
      clearTimeout(dragEndTimeoutRef.current);
    }

    // 80ms 뒤에 실행, 관성 스크롤이 시작되면 취소됨
    dragEndTimeoutRef.current = setTimeout(() => {
      handleScrollEnd(event);
      dragEndTimeoutRef.current = null;
    }, 80);
  };

  // 관성 스크롤 시작될 때 호출
  const handleMomentumScrollBegin = () => {
    // 예약해둔 타이머 취소
    if (dragEndTimeoutRef.current) {
      clearTimeout(dragEndTimeoutRef.current);
      dragEndTimeoutRef.current = null;
    }
  };

  // 관성 스크롤 끝났을 때 호출
  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // 예약해둔 타이머 취소
    if (dragEndTimeoutRef.current) {
      clearTimeout(dragEndTimeoutRef.current);
      dragEndTimeoutRef.current = null;
    }

    // 확정 호출
    handleScrollEnd(event);
  };

  // 초기 위치 활성화
  useEffect(() => {
    const selectedIndex = Math.max(
      items.findIndex((it) => it === value),
      0,
    );
    const offset = selectedIndex * itemHeight;

    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset, animated: false });
    });
  }, [itemHeight, items, value]);

  useEffect(() => {
    return () => {
      if (dragEndTimeoutRef.current) {
        clearTimeout(dragEndTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={[styles.container, { height: pickerHeight, paddingRight: suffix ? 24 : 0 }]}>
      {suffix ? (
        <View
          style={[
            styles.suffixContent,
            {
              top: verticalPadding,
              height: itemHeight,
              left: itemWidth,
            },
          ]}
          pointerEvents="none">
          <MDText style={styles.suffix} type="bodySemiBold">
            {suffix}
          </MDText>
        </View>
      ) : null}

      <FlatList
        ref={listRef}
        style={styles.list}
        data={items}
        keyExtractor={(item) => String(item)}
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
            <View style={[styles.item, { height: itemHeight, width: itemWidth }]}>
              <MDText
                style={[styles.value, { width: valueWidth }]}
                type={isSelected ? 'bodySemiBold' : 'bodyRegular'}
                color={isSelected ? colors.text.normal : colors.text.alternative}>
                {item}
              </MDText>
            </View>
          );
        }}
      />
    </View>
  );
}

const PickerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  list: {
    flex: 1,
    width: '100%',
  },
  suffixContent: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  suffix: {
    marginLeft: 4,
  },
  value: {
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
