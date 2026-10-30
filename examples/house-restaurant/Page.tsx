/**
 * 완성본 예시 — house 디렉션 · 음식점 (v0.2)
 *
 * 결정: preset=calm · direction=house · mode=light(+dark 섹션 1: 방문 정보)
 *       accent=짙은 병초록(이번 계절 표시에만) · signature=정물이 아래에서 드러나기
 *       패턴: 랜딩 D형 → EditorialSplit → DragGallery → 메뉴판(10) → 정보(9)
 *
 * AI가 이 파일에서 따라 할 것: 밀도, 여백 리듬, 글자 크기 대비, 섹션 순서, 부품 조합 방식.
 * 따라 하지 말 것: 문구·가게 이름·메뉴 — 사이트마다 새로 쓴다.
 */
import {
  Button,
  DragGallery,
  EditorialSplit,
  FullBleedMedia,
  IconArrowRight,
  MenuList,
  Reveal,
  SiteHeader,
  SpecList,
} from "../../design/components";
import { gallery, menu, roomFacts, site, visit } from "./content";

export function HouseRestaurantPage() {
  return (
    <>
      <SiteHeader
        overlay
        brandAlign="center"
        navStyle="micro"
        brand={
          <a href="#top" className="wordmark text-title-sm" aria-label={`${site.name} ${site.nameKo}, 처음으로`}>
            {site.name}
          </a>
        }
        items={[
          { label: "The room", href: "#room" },
          { label: "Menu", href: "#menu" },
          { label: "Visit", href: "#visit" },
        ]}
        action={
          <a href={`tel:${site.phone}`} className="micro-label numerals text-ink-2 transition-colors duration-150 hover:text-ink">
            {site.phone}
          </a>
        }
        menuLabel="Menu"
      />

      <main id="top">
        {/* 1. 첫 화면 — 소재가 주인공, 글자는 왼쪽 아래 한 덩어리 (시그니처: 정물이 아래에서 드러난다) */}
        <Reveal>
          <FullBleedMedia image="stills/hero.jpg" focus="right" alt="촛불 하나가 켜진 나무 테이블 위에 수프, 관자 요리, 케이크, 와인잔이 놓여 있다">
            <p className="micro-label text-ink-2">Seochon, Seoul</p>
            <Reveal kind="lift" as="div">
              <h1 className="mt-4 max-w-5xl font-display text-display-xl font-medium tracking-display text-ink">
                열두 자리,
                <br />
                장작불로 굽는 저녁
              </h1>
            </Reveal>
            <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
              <Button href={site.reserveUrl} icon={<IconArrowRight size={18} />}>
                자리 예약하기
              </Button>
              <p className="numerals text-body-sm text-ink-2">서촌 골목 2층 · 화–토 18:00–23:00</p>
            </div>
          </FullBleedMedia>
        </Reveal>

        {/* 2. 공간 — 사진 반 + 글 반 */}
        <div id="room" className="scroll-mt-16">
          <EditorialSplit
            media={
              <Reveal className="h-full">
                <img src="stills/glass.jpg" alt="낮은 촛불 뒤로 와인잔이 놓인 어두운 테이블" className="aspect-4/5 size-full object-cover md:aspect-auto" />
              </Reveal>
            }
          >
            <p className="micro-label text-ink-3">The room</p>
            <h2 className="mt-4 font-display text-title-lg font-medium tracking-title text-ink md:text-display-sm">
              불빛을 낮춘 방,
              <br />
              열두 자리
            </h2>
            <div className="mt-6 space-y-4 text-body text-ink-2">
              <p>골목으로 창이 난 2층에 바 여섯 자리와 테이블 여섯 자리를 두었어요. 조명은 테이블 위 초 하나와 낮은 등뿐이라, 저녁이 깊어질수록 방이 조용해져요.</p>
              <p>화덕 앞 바 자리에서는 장작불에 굽는 과정을 바로 앞에서 볼 수 있어요.</p>
            </div>
            <SpecList className="mt-10" items={roomFacts} align="start" labelStyle="label" />
          </EditorialSplit>
        </div>

        {/* 3. 사진 한 줄 — 사진은 여기에만 모은다 */}
        <DragGallery
          className="py-24 md:py-32"
          title={
            <>
              <p className="micro-label text-ink-3">On the table</p>
              <h2 className="mt-3 font-display text-title-lg font-medium tracking-title text-ink">이번 계절의 식탁</h2>
            </>
          }
          items={gallery.map((g) => ({
            id: g.id,
            label: g.label,
            title: g.title,
            media: <img src={g.src} alt={g.alt} draggable={false} className="aspect-4/5 w-full object-cover" />,
          }))}
        />

        {/* 4. 메뉴판 — 글자 목록. 왼쪽 단은 따라 내려온다 */}
        <section id="menu" className="container-wide scroll-mt-16 border-t border-line pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="grid gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-4">
              <div className="md:sticky md:top-28">
                <p className="micro-label text-ink-3">Menu — Autumn</p>
                <h2 className="mt-4 font-display text-title-lg font-medium tracking-title text-ink md:text-display-sm">가을 차림</h2>
                <p className="mt-5 max-w-xs text-body-sm text-ink-2">재료에 따라 매주 조금씩 바뀌어요. 알레르기가 있으면 예약할 때 알려 주세요. 가격은 원 단위예요.</p>
              </div>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <MenuList sections={menu} />
            </div>
          </div>
        </section>

        {/* 5. 방문 정보 — 어두운 섹션은 이것 하나 */}
        <section id="visit" data-mode="dark" className="scroll-mt-16 bg-bg text-ink">
          <div className="container-wide grid gap-14 py-24 md:grid-cols-12 md:gap-8 md:py-32">
            <div className="md:col-span-5">
              <p className="micro-label text-ink-3">Visit</p>
              <h2 className="mt-4 font-display text-display-sm font-medium tracking-display text-ink">
                골목 끝 계단을
                <br />
                올라오세요
              </h2>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button href={site.reserveUrl}>자리 예약하기</Button>
                <Button href={site.mapUrl} variant="secondary">
                  지도에서 보기
                </Button>
              </div>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <SpecList items={visit} align="start" labelStyle="label" />
            </div>
          </div>
          <footer className="container-wide flex flex-wrap items-center justify-between gap-4 border-t border-line py-6">
            <span className="wordmark text-body text-ink-2">{site.name}</span>
            <div className="flex items-center gap-6">
              <a href={site.instagram} className="micro-label text-ink-3 transition-colors duration-150 hover:text-ink">
                Instagram
              </a>
              <span className="text-label text-ink-3">© 2026 여울 · 사업자 정보</span>
            </div>
          </footer>
        </section>
      </main>
    </>
  );
}
