import React from 'react'
import renderer from 'react-test-renderer'
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';

import {
    ToggleComponent,
    SelectedHeadersComponent
} from '../headers/HeadersComponent'

import { ActualBootTableComponent } from '../headers/TableBootstrapComponent'

// Snapshot for Home React Component

describe('>>> Snapshots of Components', () => {

    const mockFunction = () => {}

    it('+++ check if toggle button is showing gray', () => {        
        const renderedValue = renderer.create( 
            <ToggleComponent 
                toggleCapture = { false }
                handleCaptureToggleChange = { mockFunction }
            />
        ).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });

    it('+++ check if toggle button is showing blue', () => {
        const renderedValue = renderer.create( 
            <ToggleComponent 
                toggleCapture = { true }
                handleCaptureToggleChange = { mockFunction }
            />
        ).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });

    it('+++ check if header panel is initialized correctly', () => {
        const renderedValue = renderer.create( 
            <SelectedHeadersComponent selectedHeaders = { [] } />
        ).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });

    it('+++ check if header table is initialized correctly', () => {        
        // react tets renderer doesn't work switching to enzyme - https://github.com/AllenFang/react-bootstrap-table/issues/1160


        const wrapper = shallow(
            <ActualBootTableComponent 
                data = { [] }
                headersLength = { 1 }
                rowSelectHandler = { mockFunction }
                rowSelectAllHandler = { mockFunction }
                toggleCapture = { false }
            />
        )
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});