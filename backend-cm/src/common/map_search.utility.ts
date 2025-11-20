import Supercluster, { PointFeature } from "supercluster";
import { GeoJsonProperties } from "geojson";
import { SearchMapResults } from "../investigation/investigation/dto/search-map-results";

export type ClusterConfig = {
  radius: number;
  maxZoom: number;
  defaultZoom: number;
  emptyResultZoom: number;
  emptyResultCenter: [number, number];
  expansionZoomOffset: number;
};

export class MapSearchUtility {
  static readonly WORLD_BOUNDS: [number, number, number, number] = [-180, -90, 180, 90];

  static readonly CLUSTER_CONFIG: ClusterConfig = {
    radius: 160,
    maxZoom: 16,
    defaultZoom: 18,
    emptyResultZoom: 5,
    emptyResultCenter: [55.0, -125.0],
    expansionZoomOffset: 2,
  };

  static getBoundingBoxParameters(bbox?: string): {
    bboxArray: [number, number, number, number];
    isGlobalSearch: boolean;
  } {
    if (!bbox) {
      return { bboxArray: [...this.WORLD_BOUNDS], isGlobalSearch: true };
    }

    const bboxArray = bbox.split(",").map(Number) as [number, number, number, number];
    return { bboxArray, isGlobalSearch: false };
  }

  static clusterPoints(
    points: Array<PointFeature<GeoJsonProperties>>,
    zoom: number,
    bboxArray: [number, number, number, number],
    isGlobalSearch: boolean,
    clusterConfig: ClusterConfig = this.CLUSTER_CONFIG,
  ): { clusters: any[]; zoom?: number; center?: number[] } {
    const index = new Supercluster({
      log: false,
      radius: clusterConfig.radius,
      maxZoom: clusterConfig.maxZoom,
    });
    index.load(points);

    const clusters = index.getClusters([bboxArray[0], bboxArray[1], bboxArray[2], bboxArray[3]], zoom);

    let resultZoom: number | undefined;
    let resultCenter: number[] | undefined;

    if (isGlobalSearch) {
      if (clusters.length === 1) {
        const firstCluster = clusters[0];
        const center: [number, number] = [firstCluster.geometry.coordinates[1], firstCluster.geometry.coordinates[0]];
        const expansionZoom = index.getClusterExpansionZoom(firstCluster.properties.cluster_id);

        resultZoom = expansionZoom ? expansionZoom + clusterConfig.expansionZoomOffset : clusterConfig.defaultZoom;
        resultCenter = center;
      } else if (clusters.length === 0) {
        resultZoom = clusterConfig.emptyResultZoom;
        resultCenter = clusterConfig.emptyResultCenter;
      }
    }

    for (const cluster of clusters) {
      cluster.properties.zoom = index.getClusterExpansionZoom(cluster.properties.cluster_id);
    }

    return { clusters, zoom: resultZoom, center: resultCenter };
  }

  static buildSearchMapResults(
    points: Array<PointFeature<GeoJsonProperties>>,
    unmappedCount: number,
    zoom: number,
    bboxArray: [number, number, number, number],
    isGlobalSearch: boolean,
    clusterConfig?: ClusterConfig,
  ): SearchMapResults {
    const results: SearchMapResults = {
      unmappedCount,
      mappedCount: points.length,
    };

    if (points.length === 0) {
      results.clusters = [];
      return results;
    }

    const {
      clusters,
      zoom: recommendedZoom,
      center,
    } = this.clusterPoints(points, zoom, bboxArray, isGlobalSearch, clusterConfig);
    results.clusters = clusters;
    if (recommendedZoom !== undefined) {
      results.zoom = recommendedZoom;
    }
    if (center !== undefined) {
      results.center = center;
    }
    return results;
  }
}
