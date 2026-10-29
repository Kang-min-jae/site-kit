/**
 * 가게 내용 — 페이지 코드와 분리해 둔다 (사장님이 메뉴·시간을 고칠 때 이 파일만 바꾸면 된다).
 * 여울은 이 예시를 위해 지어낸 가게다. 이름·주소·전화·메뉴·가격 모두 가상이다.
 */
import type { MenuSection, Spec } from "../../design/components";

export const site = {
  name: "YEOUL",
  nameKo: "여울",
  reserveUrl: "https://example.com/reserve", // 실제 예약 서비스 링크로 교체
  mapUrl: "https://example.com/map", // 지도 앱 링크로 교체
  phone: "02-000-0000",
  instagram: "https://example.com/instagram",
};

export const roomFacts: Spec[] = [
  { label: "자리", value: "바 6 · 테이블 6" },
  { label: "저녁 코스", value: "한 가지 · 89,000원", note: "단품으로도 주문할 수 있어요" },
  { label: "콜키지", value: "병당 30,000원" },
  { label: "주차", value: "없어요", note: "경복궁역 3번 출구에서 걸어서 6분" },
];

export const menu: MenuSection[] = [
  {
    id: "start",
    title: "처음",
    label: "To start",
    items: [
      { name: "늙은 호박 수프", desc: "구운 호박씨, 들기름", price: 14000, seasonal: true },
      { name: "제철 생굴 세 점", desc: "유자 식초, 쪽파", price: 18000, seasonal: true },
      { name: "장작에 구운 사워도우", desc: "발효 버터", price: 6000 },
    ],
  },
  {
    id: "fire",
    title: "불",
    label: "From the fire",
    items: [
      { name: "관자 화덕구이", desc: "태운 버터, 들깨", price: 32000 },
      { name: "한우 우둔 숯불구이", desc: "구운 대파, 겨자잎", price: 48000, note: "굽기 정도를 골라 주세요" },
      { name: "버섯 솥밥", desc: "표고, 잎새버섯, 달걀노른자", price: 22000, seasonal: true },
    ],
  },
  {
    id: "finish",
    title: "끝",
    label: "To finish",
    items: [
      { name: "흑임자 케이크", desc: "생크림, 볶은 깨", price: 12000 },
      { name: "구운 배", desc: "꿀, 계피", price: 11000, seasonal: true },
    ],
  },
];

export const visit: Spec[] = [
  { label: "영업 시간", value: "화–토 18:00–23:00", note: "마지막 주문 21:30 · 일·월 쉬어요" },
  { label: "주소", value: "서울 종로구 ○○길 12, 2층" },
  { label: "전화", value: site.phone },
  { label: "예약", value: "온라인 예약", note: "2주 전 같은 요일 정오에 열려요" },
];

export const gallery = [
  { id: "soup", src: "stills/soup.jpg", label: "처음", title: "늙은 호박 수프", alt: "검은 유약 그릇에 담긴 호박 수프, 위에 쪽파와 깨" },
  { id: "main", src: "stills/main.jpg", label: "불", title: "관자 화덕구이", alt: "흰 접시 위 겉을 구운 관자 네 점과 소스" },
  { id: "dessert", src: "stills/dessert.jpg", label: "끝", title: "흑임자 케이크", alt: "작은 접시 위 층층이 쌓은 케이크" },
  { id: "table", src: "stills/table.jpg", label: "곁들임", title: "잔으로 고르는 와인", alt: "촛불 옆 접시와 와인잔이 놓인 테이블" },
];
