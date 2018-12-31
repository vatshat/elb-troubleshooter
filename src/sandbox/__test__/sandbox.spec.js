import fs from "fs"
import path from "path"
import React from 'react'
import { shallow } from 'enzyme'
import HeadersReduxConnect from '../../content/containers/HeadersReduxConnect'
import configureStore from 'redux-mock-store'

describe('>>> Connected Components',()=>{
    const jsonState = JSON.parse(fs.readFileSync(path.join(__dirname) + "\\..\\sandbox.json"))
    const mockStore = configureStore()
    let store, wrapper
    let mockState = jsonState.initialState

    beforeEach(() => {
        store = mockStore(mockState)
        wrapper = shallow(<HeadersReduxConnect store={store} />)
    })


    it('+++ render the smart/container component', () => {
        expect(wrapper.length).toEqual(1)        
    });
    
    it('+++ check props initialize properly', () => {
        expect(wrapper.prop('headersRowList')).toHaveLength(0)
        expect(wrapper.prop('selectedHeaders')).toHaveLength(0)
        expect(wrapper.prop('toggleCapture')).toBe(false)        
        mockState = jsonState.updateState
    });
    
    it('+++ check props are updated properly with new state', () => {
        const { actualHeaders, preHeaders } = mockState.headers
        const { selectedHeaders, preHeaderCount } = preHeaders

        expect(wrapper.prop('headersRowList')).toHaveLength(actualHeaders.length)
        expect(wrapper.prop('selectedHeaders')).toHaveLength(selectedHeaders.length)
        expect(wrapper.prop('preHeaderCount')).toEqual(preHeaderCount)
        expect(wrapper.prop('toggleCapture')).toBe(false)
    });
});