import { Scalar, CustomScalar } from "@nestjs/graphql";
import { Kind, ValueNode } from "graphql";
import { GraphQLJSONObject } from "graphql-type-json";

@Scalar("Date")
export class DateScalar implements CustomScalar<string, Date> {
  description = "Date custom scalar type";

  parseValue(value: number): Date {
    return new Date(value);
  }
  serialize(value: Date): string {
    return value.toISOString();
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  }
}

@Scalar("JSONObject", () => GraphQLJSONObject)
export class JSONObjectScalar {
  description = "JSONObject custom scalar type";

  parseValue(value: any): any {
    return value;
  }

  serialize(value: any): any {
    return value;
  }

  parseLiteral(ast: ValueNode): any {
    if (ast.kind === Kind.OBJECT) {
      return ast;
    }
    return null;
  }
}

// GeoJSON Point scalar type for geographic coordinates
// Introduced interface with type and array to support RFC 7946
export interface Point {
  type: string;
  coordinates: number[];
}
@Scalar("Point")
export class PointScalar implements CustomScalar<Point, Point> {
  description = "GeoJSON Point scalar type for geographic coordinates";

  parseValue(value: any): Point {
    if (!value) return null;

    if (value.type === "Point" && Array.isArray(value.coordinates)) {
      return value;
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (parsed.type === "Point" && Array.isArray(parsed.coordinates)) {
          return parsed;
        }
      } catch (error) {
        console.error("Error parsing Point:", error);
        return null;
      }
    }

    return null;
  }

  serialize(value: any): Point {
    if (!value) return null;

    if (value.type === "Point" && Array.isArray(value.coordinates)) {
      return {
        type: "Point",
        coordinates: value.coordinates,
      };
    }

    return null;
  }

  parseLiteral(ast: ValueNode): Point {
    if (ast.kind === Kind.STRING) {
      try {
        const parsed = JSON.parse(ast.value);
        if (parsed.type === "Point" && Array.isArray(parsed.coordinates)) {
          return parsed;
        }
      } catch (error) {
        console.error("Error parsing Point:", error);
        return null;
      }
    }
    return null;
  }
}
