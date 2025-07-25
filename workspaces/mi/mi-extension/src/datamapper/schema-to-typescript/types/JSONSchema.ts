/**
 * This file includes code originally from:
 *   json-schema-to-typescript (https://github.com/bcherny/json-schema-to-typescript)
 *   Copyright (c) Boris Cherny
 *   Licensed under the MIT License: https://opensource.org/licenses/MIT
 *
 * Modifications and additional code copyright (c) 2025, WSO2 LLC. (https://www.wso2.com)
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {JSONSchema4, JSONSchema4Type, JSONSchema4TypeName} from 'json-schema'
import {isPlainObject, memoize} from 'lodash'

export type SchemaType =
  | 'ALL_OF'
  | 'UNNAMED_SCHEMA'
  | 'ANY'
  | 'ANY_OF'
  | 'BOOLEAN'
  | 'NAMED_ENUM'
  | 'NAMED_SCHEMA'
  | 'NEVER'
  | 'NULL'
  | 'NUMBER'
  | 'STRING'
  | 'OBJECT'
  | 'ONE_OF'
  | 'TYPED_ARRAY'
  | 'REFERENCE'
  | 'UNION'
  | 'UNNAMED_ENUM'
  | 'UNTYPED_ARRAY'
  | 'CUSTOM_TYPE'

export type JSONSchemaTypeName = JSONSchema4TypeName
export type JSONSchemaType = JSONSchema4Type

export interface JSONSchema extends JSONSchema4 {
  /**
   * schema extension to support numeric enums
   */
  tsEnumNames?: string[]
  /**
   * schema extension to support custom types
   */
  tsType?: string
  /**
   * property exists at least in https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.9.3
   */
  deprecated?: boolean
}

export const Parent = Symbol('Parent')

export interface LinkedJSONSchema extends JSONSchema {
  /**
   * A reference to this schema's parent node, for convenience.
   * `null` when this is the root schema.
   */
  [Parent]: LinkedJSONSchema | null

  additionalItems?: boolean | LinkedJSONSchema
  additionalProperties?: boolean | LinkedJSONSchema
  items?: LinkedJSONSchema | LinkedJSONSchema[]
  definitions?: {
    [k: string]: LinkedJSONSchema
  }
  properties?: {
    [k: string]: LinkedJSONSchema
  }
  patternProperties?: {
    [k: string]: LinkedJSONSchema
  }
  dependencies?: {
    [k: string]: LinkedJSONSchema | string[]
  }
  allOf?: LinkedJSONSchema[]
  anyOf?: LinkedJSONSchema[]
  oneOf?: LinkedJSONSchema[]
  not?: LinkedJSONSchema
}

export interface NormalizedJSONSchema extends LinkedJSONSchema {
  additionalItems?: boolean | NormalizedJSONSchema
  additionalProperties: boolean | NormalizedJSONSchema
  extends?: string[]
  items?: NormalizedJSONSchema | NormalizedJSONSchema[]
  $defs?: {
    [k: string]: NormalizedJSONSchema
  }
  properties?: {
    [k: string]: NormalizedJSONSchema
  }
  patternProperties?: {
    [k: string]: NormalizedJSONSchema
  }
  dependencies?: {
    [k: string]: NormalizedJSONSchema | string[]
  }
  allOf?: NormalizedJSONSchema[]
  anyOf?: NormalizedJSONSchema[]
  oneOf?: NormalizedJSONSchema[]
  not?: NormalizedJSONSchema
  required: string[]

  // Removed by normalizer
  definitions: never
  id: never
}

export interface EnumJSONSchema extends NormalizedJSONSchema {
  enum: any[]
}

export interface NamedEnumJSONSchema extends NormalizedJSONSchema {
  tsEnumNames: string[]
}

export interface SchemaSchema extends NormalizedJSONSchema {
  properties: {
    [k: string]: NormalizedJSONSchema
  }
  required: string[]
}

export interface JSONSchemaWithDefinitions extends NormalizedJSONSchema {
  $defs: {
    [k: string]: NormalizedJSONSchema
  }
}

export interface CustomTypeJSONSchema extends NormalizedJSONSchema {
  tsType: string
}

export const getRootSchema = memoize((schema: LinkedJSONSchema): LinkedJSONSchema => {
  const parent = schema[Parent]
  if (!parent) {
    return schema
  }
  return getRootSchema(parent)
})

export function isBoolean(schema: LinkedJSONSchema | JSONSchemaType): schema is boolean {
  return schema === true || schema === false
}

export function isPrimitive(schema: LinkedJSONSchema | JSONSchemaType): schema is JSONSchemaType {
  return !isPlainObject(schema)
}

export function isCompound(schema: JSONSchema): boolean {
  return Array.isArray(schema.type) || 'anyOf' in schema || 'oneOf' in schema
}
