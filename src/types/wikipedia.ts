export interface WikipediaPage {
  title: string;
  pageid: number;
  extract?: string;
}

export interface WikipediaSearchResult {
  query: {
    search: Array<{
      title: string;
      pageid: number;
      snippet: string;
    }>;
  };
}

export interface WikipediaLinksResult {
  query: {
    pages: {
      [key: string]: {
        title: string;
        links?: Array<{
          title: string;
        }>;
      };
    };
  };
}

export interface PathResult {
  path: string[];
  found: boolean;
  searchedPages: number;
  timeElapsed: number;
}