---
title: "Source: llm-wiki.md"
created: 2026-04-09
updated: 2026-04-09
sources: [raw/llm-wiki.md]
tags: [source, framework, personal-knowledge-base]
---

# Source: llm-wiki.md (제안서 요약)

이 문서는 지식의 단순 검색(RAG) 한계를 극복하고, LLM을 통해 지식을 지속적으로 **축적**하고 **컴파일**하는 시스템에 대한 제안서입니다.

## 핵심 요약

- **지속성(Compounding)**: 정보를 매번 새로 찾는 대신, 기존 위키 페이지를 업데이트하여 지식을 누적함.
- **3계층 아키텍처**:
    1. **Raw Source**: 불변의 원본 데이터.
    2. **Wiki**: LLM이 관리하는 마크다운 파일들의 집합.
    3. **Schema**: 관리 규칙과 워크플로우(`GEMINI.md`).
- **운영 프로세스**:
    - **Ingest**: 새로운 지식을 위키에 통합.
    - **Query**: 위키 지식을 기반으로 답변 생성 및 가치 있는 답변을 다시 위키화.
    - **Lint**: 문서 간 모순이나 끊긴 링크 등을 주기적으로 점검.

## 관련 개념 및 페이지
- [[LLM Wiki Pattern]]: 이 제안서가 정의하는 방법론.
- [[GEMINI.md]]: 이 프로젝트에 적용된 실제 스키마.

## 원본 파일
- [llm-wiki.md](file:///Users/sohyunsoo/Documents/me/raw/llm-wiki.md)
