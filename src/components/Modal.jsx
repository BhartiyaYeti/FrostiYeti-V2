import React from 'react'

const Modal = ({modalInfoText, setShowModal}) => {
  return (
    <div className='modal'>
        <div className='modal-info bg-[#EEEEEE] text-black text-center py-6 rounded-md'>
            <h1 className="text-[#111] text-3xl font-bold first-letter:uppercase">
              {modalInfoText}
            </h1>
            <button
                onClick={() => setShowModal(false)}
                className="bg-[#55C8ED] px-6 py-2 my-5 hover:bg-[#111] hover:text-white"
            >
                OK!
            </button>
        </div>
    </div>
  )
}

export default Modal