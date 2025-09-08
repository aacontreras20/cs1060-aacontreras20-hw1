import { WikipediaApi } from './wikipediaApi';

export interface PathfindingProgress {
  currentPage: string;
  searchedPages: number;
  queueSize: number;
  depth: number;
}

export class WikipediaPathfinder {
  private maxDepth: number = 3;
  private maxSearchedPages: number = 1000;
  
  async findPath(
    startPage: string, 
    endPage: string, 
    onProgress?: (progress: PathfindingProgress) => void
  ): Promise<{path: string[], found: boolean, searchedPages: number, timeElapsed: number}> {
    const startTime = Date.now();
    
    // Normalize page titles
    const normalizedStart = this.normalizeTitle(startPage);
    const normalizedEnd = this.normalizeTitle(endPage);
    
    if (normalizedStart === normalizedEnd) {
      return {
        path: [startPage],
        found: true,
        searchedPages: 0,
        timeElapsed: Date.now() - startTime
      };
    }

    // Verify both pages exist
    const [startExists, endExists] = await Promise.all([
      WikipediaApi.pageExists(startPage),
      WikipediaApi.pageExists(endPage)
    ]);

    if (!startExists || !endExists) {
      throw new Error(!startExists ? 
        `Start page "${startPage}" not found` : 
        `End page "${endPage}" not found`);
    }

    // BFS implementation
    const queue: Array<{page: string, path: string[], depth: number}> = [{
      page: startPage,
      path: [startPage],
      depth: 0
    }];
    
    const visited = new Set<string>([normalizedStart]);
    let searchedPages = 0;

    while (queue.length > 0 && searchedPages < this.maxSearchedPages) {
      const current = queue.shift()!;
      
      // Update progress
      onProgress?.({
        currentPage: current.page,
        searchedPages,
        queueSize: queue.length,
        depth: current.depth + 1
      });

      // Stop if we've reached max depth
      if (current.depth >= this.maxDepth) {
        continue;
      }

      try {
        const links = await WikipediaApi.getPageLinks(current.page);
        searchedPages++;

        // Check if we found the target
        const targetFound = links.find(link => 
          this.normalizeTitle(link) === normalizedEnd
        );

        if (targetFound) {
          return {
            path: [...current.path, endPage],
            found: true,
            searchedPages,
            timeElapsed: Date.now() - startTime
          };
        }

        // Add unvisited links to queue
        for (const link of links.slice(0, 50)) { // Limit links per page
          const normalizedLink = this.normalizeTitle(link);
          
          if (!visited.has(normalizedLink)) {
            visited.add(normalizedLink);
            queue.push({
              page: link,
              path: [...current.path, link],
              depth: current.depth + 1
            });
          }
        }

        // Add small delay to prevent overwhelming the API
        if (searchedPages % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (error) {
        console.error(`Error processing ${current.page}:`, error);
        continue;
      }
    }

    return {
      path: [],
      found: false,
      searchedPages,
      timeElapsed: Date.now() - startTime
    };
  }

  private normalizeTitle(title: string): string {
    return title.trim().replace(/ /g, '_').toLowerCase();
  }
}