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

  const [text, setText] = useState<string>('12345678901');
  const pages = useMemo(() => splitText({ text, length: MAX_TEXT_LENGTH_PER_PAGE }), [text]);

  useEffect(() => {
    console.log(pages);
  }, [pages]);

  return (
    <MDView style={styles.container}>
      {pages.map((page, index) => (
        <Page key={index} pageIndex={index} text={page} />
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

function Page({ pageIndex, text }: { pageIndex: number; text: string }) {
  const colors = useThemeColor();
  const styles = pageStyles({ colors });

  return (
    <MDView style={styles.container}>
      <MDText>{text}</MDText>
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
