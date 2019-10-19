import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { puppy_version } from '../../puppy-transpiler/puppy';

type VersionProps = {
  show: boolean;
  setShow: (show: boolean) => void;
};

const Version: React.FC<VersionProps> = (props: VersionProps) => {
  return (
    <>
      <Modal show={props.show} onHide={() => props.setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Puppy</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ whiteSpace: 'pre-line' }}>
          <p>{`Version: ${puppy_version()}`}</p>
          <p>{'Browser: Google Chrome (OS X), Firefox'}</p>
          <p>
            If you find some bugs or suggestions, please send issues in{' '}
            <a href="https://github.com/playpuppy/LIVE2019" target="blank">
              {'GitHub'}
            </a>
            .
          </p>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={() => props.setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => props.setShow(false)}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

// render(<Example />);

export default Version;
