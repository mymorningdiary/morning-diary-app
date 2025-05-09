import { MDCol, MDRow, MDText, MDView } from '@/components';
import { WriteAppBar, WriteProgressBar } from '@/components/write';
import { useUser } from '@/contexts/UserContext';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

const MAX_TEXT_LENGTH_PER_PAGE = 10;

const splitText = ({ text, length }: { text: string; length: number }): string[] => {
  if (length <= 0) return text.split('');

  const result = [];
  for (let i = 0; i < text.length; i += length) {
    result.push(text.slice(i, i + length));
  }
  return result;
};

export default function Write() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });

  const { user } = useUser();

  const maxTextLength = useMemo(() => {
    const goalPage = user?.goalPage ?? 1;
    return goalPage * MAX_TEXT_LENGTH_PER_PAGE;
  }, [user?.goalPage]);

  const [text, setText] = useState<string>('');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [pages, setPages] = useState<string[]>(['']); // pages를 state로 관리

  const inputRefs = useRef<Map<number, TextInput | null>>(new Map());

  const setInputRef = (index: number, ref: TextInput | null) => {
    if (ref) {
      inputRefs.current.set(index, ref);
    } else {
      inputRefs.current.delete(index);
    }
  };

  useEffect(() => {
    console.log(text);
    console.log(pages);
  }, [text, pages]);

  const handleTextChange = ({ text: newText, index }: { text: string; index: number }) => {
    setPages((prevPages) => {
      const newPages = [...prevPages];
      newPages[index] = newText;

      // 현재 페이지의 텍스트가 MAX_TEXT_LENGTH_PER_PAGE를 초과하면
      // 다음 페이지로 이동하고 나머지 텍스트를 다음 페이지로 이동
      if (newText.length > MAX_TEXT_LENGTH_PER_PAGE) {
        const currentPageText = newText.slice(0, MAX_TEXT_LENGTH_PER_PAGE);
        const remainingText = newText.slice(MAX_TEXT_LENGTH_PER_PAGE);

        newPages[index] = currentPageText;

        // 다음 페이지가 없으면 새로 생성
        if (!newPages[index + 1]) {
          newPages.push(remainingText);
        } else {
          newPages[index + 1] = remainingText + newPages[index + 1];
        }

        setCurrentPageIndex(index + 1);
      }

      return newPages;
    });
  };

  // 페이지 삭제를 위한 별도의 핸들러
  const handlePageDelete = (index: number) => {
    console.log('handlePageDelete', index);
    setPages((prevPages) => {
      // 마지막 페이지는 삭제하지 않음
      if (index === prevPages.length - 1) {
        return prevPages;
      }

      const newPages = [...prevPages];
      // 현재 페이지의 텍스트를 다음 페이지와 합침
      if (index + 1 < newPages.length) {
        newPages[index + 1] = newPages[index] + newPages[index + 1];
      }
      // 현재 페이지 삭제
      newPages.splice(index, 1);

      // 현재 페이지 인덱스 조정
      setCurrentPageIndex(Math.max(0, index - 1));

      return newPages;
    });
  };

  // TextInput의 onKeyPress 이벤트 핸들러
  const handleKeyPress = ({ nativeEvent, index }: { nativeEvent: any; index: number }) => {
    // 백스페이스 키를 누르고 현재 페이지가 비어있을 때
    if (nativeEvent.key === 'Backspace' && pages[index] === '' && index > 0) {
      console.log('backspace');
      handlePageDelete(index);
    }
  };

  useEffect(() => {
    // 다음 렌더링 사이클에서 포커스 실행
    requestAnimationFrame(() => {
      const input = inputRefs.current.get(currentPageIndex);
      if (input) {
        input.focus();
      }
    });
  }, [currentPageIndex]);
  return (
    <MDView style={styles.container}>
      {pages.map((text, index) => (
        <Page
          key={index}
          index={index}
          text={text}
          setInputRef={setInputRef}
          onChangeText={handleTextChange}
          onKeyPress={handleKeyPress}
        />
      ))}
    </MDView>
  );
}

const screenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
      gap: 16,
    },
  });

function Page({
  index,
  text,
  setInputRef,
  onChangeText,
  onKeyPress,
}: {
  index: number;
  text: string;
  setInputRef: (index: number, ref: TextInput | null) => void;
  onChangeText: ({ text, index }: { text: string; index: number }) => void;
  onKeyPress: ({ nativeEvent, index }: { nativeEvent: any; index: number }) => void;
}) {
  const colors = useThemeColor();
  const styles = pageStyles({ colors });

  return (
    <MDView style={styles.container}>
      <TextInput
        ref={(ref) => setInputRef(index, ref)}
        value={text}
        onChangeText={(value) => onChangeText({ text: value, index })}
        onKeyPress={(e) => onKeyPress({ nativeEvent: e.nativeEvent, index })}
      />
      <MDText>{`${index + 1}페이지`}</MDText>
    </MDView>
  );
}

const pageStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
      padding: 16,
    },
  });
