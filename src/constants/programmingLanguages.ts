import { langs } from '@uiw/codemirror-extensions-langs';

export enum EProgrammingLanguages {
    JAVASCRIPT = "Javascript",
    PYTHON = "Python",
    JAVA = "Java",
    CPP = "C++",
    C = "C",
}

export const SUPPORTED_LANGUAGES_CODES = {
    [EProgrammingLanguages.JAVASCRIPT]: 63,
    [EProgrammingLanguages.PYTHON]: 71,
    [EProgrammingLanguages.JAVA]: 62,
    [EProgrammingLanguages.CPP]: 54,
    [EProgrammingLanguages.C]: 50,
}

export const SUPPORTED_LANGUAGES_EXTENSIONS = {
    [EProgrammingLanguages.JAVASCRIPT]: langs.javascript(),
    [EProgrammingLanguages.PYTHON]: langs.python(),
    [EProgrammingLanguages.JAVA]: langs.java(),
    [EProgrammingLanguages.CPP]: langs.cpp(),
    [EProgrammingLanguages.C]: langs.c(),
}