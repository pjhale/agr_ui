import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import PropTypes from 'prop-types';

const textSorter = (textRender, field) => {
  return (a, b, order) => {
    if (order === 'desc') {
      return textRender(a[field]).localeCompare(textRender(b[field]));
    } else {
      return textRender(b[field]).localeCompare(textRender(a[field]));
    }
  };
};

const textFilter = {
  type: 'TextFilter',
  delay: 100,
  placeholder: ' '
};

 function DownloadButton({ bootStrapTableOnClick }) {
   /*
   This handler is fired by the react-bootstrap DropdownButton component
   when the user has selected an export option (tsv or csv).  It passes
  in the eventKey from the MenuItem that was selected by the user.
    */
    function handleOnSelect(eventKey) {
     /*
    Fire the user specified action and pass the key
     and react-bootstrap-table onClick function.
     */
      onSelect(eventKey, bootStrapTableOnClick);
   }
   return (
     <div>
       <DropdownButton bsStyle='default' title='Export' id='export'>
         <MenuItem eventKey='csv'>CSV</MenuItem>
         <MenuItem eventKey='tsv'>TSV</MenuItem>
       </DropdownButton>
     </div>
   );
 }
 DownloadButton.propTypes = {
   // The onClick handler received from react-bootstrap-table.
   bootStrapTableOnClick: PropTypes.func.isRequired,
   // A handler that fires when the user selects an export option.
   // onSelect: PropTypes.func.isRequired
 };


class LocalDataTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      extension: 'tsv',
      separator: '\t'
    };

    this.updateExportOpts = this.updateExportOpts.bind(this);
    this.getFilename = this.getFilename.bind(this);
  }

  /*
  Custom Download button that uses the DropdownButton component
  from react-bootstrap.
  */
  function DownloadButton({ bootStrapTableOnClick, onSelect }) {
   /*
   This handler is fired by the react-bootstrap DropdownButton component
   when the user has selected an export option (tsv or csv).  It passes
   in the eventKey from the MenuItem that was selected by the user.
    */
   function handleOnSelect(eventKey) {
     /*
     Fire the user specified action and pass the key
     and react-bootstrap-table onClick function.
     */
     onSelect(eventKey, bootStrapTableOnClick);
   }
   return (
     <div>
       <DropdownButton bsStyle='default' title='Export' id='export' onSelect={ handleOnSelect }>
         <MenuItem eventKey='csv'>CSV</MenuItem>
         <MenuItem eventKey='tsv'>TSV</MenuItem>
       </DropdownButton>
     </div>
   );
  }
  DownloadButton.propTypes = {
   // The onClick handler received from react-bootstrap-table.
   bootStrapTableOnClick: PropTypes.func.isRequired,
   // A handler that fires when the user selects an export option.
   onSelect: PropTypes.func.isRequired
  };

  getFilename(){
    return this.props.filename + '.' + this.state.extension;
  }

  updateExportOpts(format, tableOnClick) {
     /*
      Here we pass the react-bootstrap-table onClick event handler to setState
      to ensure that it gets called after the state has been mutated.
      */
    if (format === 'tsv') {
      this.setState({ extension: 'tsv', separator: '\t' }, tableOnClick);
    } else {
      this.setState({ extension: 'csv', separator: ',' }, tableOnClick);
    }
  }

  render() {
    const { columns, data, filename } = this.props;
    const options = {
      exportCSVBtn: (onClick) => <DownloadButton bootStrapTableOnClick={ onClick } onSelect={ this.updateExportOpts } />,
      exportCSVSeparator: this.state.separator,
      exportCSVText: 'Download',
      toolbarPosition: 'bottom', //move download button to the bottom
      paginationPosition: 'top',
      sizePerPage: 6,
      sizePerPageList: [ {
        text: '6', value: 6
      }, {
        text: 'All', value: this.props.data.length
      } ],
    };
    return (
      <BootstrapTable
        bordered={false}
        csvFileName={this.getFilename}
        data={data}
        exportCSV
        options={options}
        pagination
        ref={(table) => {this.tableRef = table;}}
        version='4'
      >
        {
          columns.map((col, idx) =>
            <TableHeaderColumn
              csvFormat={col.asText}
              csvHeader={col.label}
              dataField={col.field}
              dataFormat={col.format}
              dataSort={col.sortable}
              filter={col.filterable ? textFilter : null}
              isKey={col.isKey}
              key={idx}
              sortFunc={col.asText && textSorter(col.asText, col.field)}
            >
              {col.label}
            </TableHeaderColumn>
          )
        }
      </BootstrapTable>
    );
  }
}

LocalDataTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  filename: PropTypes.string,
  paginated: PropTypes.bool,
};

export default LocalDataTable;
