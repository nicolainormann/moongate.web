namespace YoutubeModule {
	class YoutubeController {
		constructor() {
		}
	}

	class YoutubeComponent implements ng.IComponentOptions {
		public bindings: any;
		public controller: any;
		public template: string;

		constructor() {
			this.bindings = {
				
			};
			this.controller = YoutubeController;
			this.template = youtube.html;
		}
	}

	angular.module(moduleId).component("youtube", new YoutubeComponent());
} 