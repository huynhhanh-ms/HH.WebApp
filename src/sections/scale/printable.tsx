import './print-style.css'

import { Component } from "react";

import { Box, Typography } from '@mui/material';

interface Props {
  innerRef: React.RefObject<HTMLDivElement>;
}


export class Printable extends Component<Props> {
  render() {
    const { innerRef } = this.props;
    const contentLeft = [
      {
        title: 'Số Phiếu',
        value: '0'
      },
      {
        title: 'Khách hàng',
        value: 'Long lương'
      },
    ];
    return (
      <div ref={innerRef}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h4">Phiếu cân xe</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', whiteSpace: '1' }}>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', rowGap:'2px', flexDirection:'column'}}>
            {
              contentLeft.map((item) => (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', whiteSpace: '1' }}>
                  <Typography variant="body1">{item.title}</Typography>
                  <Typography variant="body1">{item.value}</Typography>
                </Box>))
            }
          </Box>
        </Box>
      </div>
    )
  }
}