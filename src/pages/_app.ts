import type { App } from "vue";
import MasonryWall from "@yeger/vue-masonry-wall";

export default (app: App) => {
	app.use(MasonryWall);
};
