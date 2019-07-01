import React from 'react';
import DmButton from '../shared/DmButton';
import { FaRegThumbsUp, FaCartPlus } from "react-icons/fa";


const ProdWidget = () => {
  return (
    <table style={{width: '100%', margin: "10px 0"}}><tbody><tr>
      <td style={{width: '50%'}}>
        <DmButton text={<FaRegThumbsUp />}
        click={() => null}
        className="margin-top-10 button-transparent" />
      </td>
      <td style={{width: '50%'}}>
        <DmButton text={<FaCartPlus />}
        click={() => null}
        className="margin-top-10 button-grey" />
      </td>
    </tr></tbody></table>);
};

export default ProdWidget;
