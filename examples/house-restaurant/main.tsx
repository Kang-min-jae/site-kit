// 정적 미리보기 진입점 — scripts/build-example.mjs가 묶는다.
import { createRoot } from "react-dom/client";
import { HouseRestaurantPage } from "./Page";

createRoot(document.getElementById("root")!).render(<HouseRestaurantPage />);
