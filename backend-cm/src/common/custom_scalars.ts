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
