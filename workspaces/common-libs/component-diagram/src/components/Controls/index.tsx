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

import React from "react";

import styled from "@emotion/styled";
import { Colors } from "../../resources/constants";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { loadDiagramZoomAndPosition, resetDiagramZoomAndPosition } from "../../utils/diagram";
import { FitScreenIcon } from "../../resources/icons/FitScreenIcon";
import { PlusIcon } from "../../resources/icons/nodes/PlusIcon";
import { MinusIcon } from "../../resources/icons/MinusIcon";

export namespace ControlsStyles {
    export const Container = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 8px;

        position: fixed;
        margin-top: 270px;
        left: 20px;
        margin-left: 10px;
        z-index: 1000;
    `;

    export const GroupContainer = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0;

        & > *:not(:last-child) {
            border-bottom: 1px solid ${Colors.OUTLINE_VARIANT};
        }

        & > *:first-child {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }

        & > *:last-child {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }

        & > *:not(:first-child):not(:last-child) {
            border-radius: 0;
        }
    `;

    export const Button = styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 8px;
        border-radius: 4px;
        background-color: ${Colors.SURFACE};
        fill: ${Colors.ON_SURFACE};
        width: 32px;
        height: 32px;
        cursor: pointer;

        &:hover {
            background-color: ${Colors.SURFACE_CONTAINER};
        }

        &:active {
            background-color: ${Colors.SURFACE_CONTAINER};
        }
    `;
}

interface ControlsProps {
    engine: DiagramEngine;
}

export function Controls(props: ControlsProps) {
    const { engine } = props;

    const handleZoomToFit = () => {
        if (engine.getCanvas()?.getBoundingClientRect) {
            engine.zoomToFitNodes({ margin: 40, maxZoom: 1 });
            engine.repaintCanvas();
        }
    };

    const onZoom = (zoomIn: boolean) => {
        const delta: number = zoomIn ? +5 : -5;
        engine.getModel().setZoomLevel(engine.getModel().getZoomLevel() + delta);
        engine.repaintCanvas();
    };

    return (
        <ControlsStyles.Container>
            <ControlsStyles.Button onClick={handleZoomToFit}>
                <FitScreenIcon />
            </ControlsStyles.Button>
            <ControlsStyles.GroupContainer>
                <ControlsStyles.Button onClick={() => onZoom(true)}>
                    <PlusIcon />
                </ControlsStyles.Button>
                <ControlsStyles.Button onClick={() => onZoom(false)}>
                    <MinusIcon />
                </ControlsStyles.Button>
            </ControlsStyles.GroupContainer>
        </ControlsStyles.Container>
    );
}

export default Controls;
