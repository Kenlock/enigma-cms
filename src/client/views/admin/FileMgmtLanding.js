import React, { useEffect, useState } from 'react';
import { object } from 'prop-types';
import { get as axget } from 'axios';
import { TextHeader } from '../../reusables';
import { TablePaginator } from 'react-everafter';
import { delete as axdel } from 'axios';

function FileMgmtLanding({ staticContext }) {
  function handleDeleteClick() {
    return function(url) {
      axdel(url);
    }
  }

  let [state, setState] = useState({
    files: []
  });

  useEffect(function() {
    let { files } = staticContext;
    if (files) {
      setState({ files });
    }
    else {
      axget('/api/files/get').then(({ data }) => {
        setState({ files: data })
      });
    }
  }, []);

  let { files } = state;

  return [
    <TextHeader>Manage Files</TextHeader>,
    <a href='/admin/upload-file'>Upload File</a>,
    files.length ? <TablePaginator perPage={10} activeTabColor="cadetblue"
      items={files} truncate={true} columns={[
        {
          headerText: 'File Name',
          display: ({ fileName }) => <p>{fileName}</p>
        },
        {
          headerText: 'File Type',
          display: ({ fileType }) => <p>{fileType}</p>
        },
        {
          headerText: 'Preview',
          display: ({ fileType, fileName }) => {
            if (fileType === 'image')
              return <img style={{ height: '100px', width: 'auto' }}
                src={`/uploads/${fileType}/${fileName}`} />;
            else if (fileType === 'audio')
              return <audio controls>
                <source src={`/uploads/${fileType}/${fileName}`} />
              </audio>;
            else if (fileType === 'video')
              return <video controls>
                <source src={`/uploads/${fileType}/${fileName}`} />
              </video>;
            return <a href= {`/uploads/${fileType}/${fileName}`}>
              Download</a>;
          }
        },
        {
          headerText: 'Delete',
          display: ({ fileType, _id }) =>
            <button onClick={() => handleDeleteClick()(
              `/api/files/delete_file/${fileType}/${_id}`)}>Delete</button>
        },
        {
          headerText: 'Date Created',
          display: ({ createdDate }) => <p>{createdDate.toString()}</p>
        }
      ]} /> : null
  ];
}

FileMgmtLanding.propTypes = {
  staticContext: object
};

export default FileMgmtLanding;
