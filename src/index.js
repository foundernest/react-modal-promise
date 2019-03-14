import React, { useRef } from 'react'
import ModalFactory from './ModalFactory'

let modalFactoryRef = {}

const PromiseModal = () => {
  modalFactoryRef = useRef(null)
  return <ModalFactory ref={modalFactoryRef} />
}

const createModal = (Component, options) => props => modalFactoryRef.current.addModal(Component, options)(props)

export default PromiseModal

export { createModal }
