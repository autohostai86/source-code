import React from 'react'
import { Card, CardBody, CardTitle } from 'reactstrap'

const CardItem = ({ iconClass, count, text }) => {
  return (
    <div className="col-12 col-md-3 mb-4"> {/* This handles responsiveness */}
      <Card className="max-w-sm bg-white 
      border border-gray-200 rounded-lg shadow-sm h-100">
        <CardBody className="d-flex justify-content-between">
          <div className='ml-2'>
            <CardTitle tag="h5" className="mb-2">
              {text}
            </CardTitle>
            <span className="h2 font-weight-bold mb-0">{count}</span>
          </div>
            <div className="icon icon-shape bg-blue blue-color-icon rounded-circle shadow me-3">
            <i className={iconClass} />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default CardItem
