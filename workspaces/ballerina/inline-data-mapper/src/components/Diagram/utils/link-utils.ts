/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { LinkModel, PortModel } from "@projectstorm/react-diagrams-core";
import { TypeKind } from "@wso2/ballerina-core";

import { InputOutputPortModel } from "../Port";
import { DataMapperLinkModel, MappingType } from "../Link";

export function isSourcePortArray(port: PortModel): boolean {
    if (port instanceof InputOutputPortModel) {
        const field = port.attributes.field;
        return field?.kind === TypeKind.Array;
    }
    return false;
}

export function isTargetPortArray(port: PortModel): boolean {
    if (port instanceof InputOutputPortModel) {
        const field = port.attributes.field;
        return field?.kind === TypeKind.Array;
    }
    return false;
}


export function removePendingMappingTempLinkIfExists(link: LinkModel) {
	const sourcePort = link.getSourcePort();
	const targetPort = link.getTargetPort();

	const pendingMappingType = link instanceof DataMapperLinkModel && link.pendingMappingType;

	if (pendingMappingType) {
		sourcePort?.fireEvent({}, "link-removed");
		targetPort?.fireEvent({}, "link-removed");
		link.pendingMappingType = MappingType.Default;
		link.remove();
	}
}
