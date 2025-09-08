const WIKIPEDIA_BASE_URL = 'https://en.wikipedia.org/w/api.php';

export class WikipediaApi {
  private static async makeRequest(params: Record<string, string>) {
    const url = new URL(WIKIPEDIA_BASE_URL);
    url.searchParams.set('format', 'json');
    url.searchParams.set('origin', '*');
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Wikipedia API error: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async searchPages(query: string, limit: number = 8): Promise<Array<{title: string; snippet: string}>> {
    if (!query.trim()) return [];
    
    try {
      const data = await this.makeRequest({
        action: 'query',
        list: 'search',
        srsearch: query,
        srlimit: limit.toString(),
        srprop: 'snippet'
      });

      return data.query.search.map((item: any) => ({
        title: item.title,
        snippet: item.snippet.replace(/<[^>]*>/g, '') // Remove HTML tags
      }));
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  static async pageExists(title: string): Promise<boolean> {
    try {
      const data = await this.makeRequest({
        action: 'query',
        titles: title,
        format: 'json'
      });

      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      return pageId !== '-1';
    } catch (error) {
      return false;
    }
  }

  static async getPageLinks(title: string, limit: number = 500): Promise<string[]> {
    try {
      const data = await this.makeRequest({
        action: 'query',
        titles: title,
        prop: 'links',
        pllimit: limit.toString(),
        plnamespace: '0' // Only main namespace articles
      });

      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      
      if (pageId === '-1' || !pages[pageId].links) {
        return [];
      }

      return pages[pageId].links
        .map((link: any) => link.title)
        .filter((title: string) => 
          !title.includes(':') && // Filter out non-article pages
          !title.startsWith('List of') // Filter out list pages for better results
        );
    } catch (error) {
      console.error('Links error:', error);
      return [];
    }
  }
}