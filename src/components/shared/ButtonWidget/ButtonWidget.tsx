import React from 'react';
import DmButton from '../DmButton';
import { FaRegThumbsUp, FaCartPlus } from "react-icons/fa";


const ButtonWidget: React.SFC = () => {
  return (
    <table style={{width: '100%', margin: "5px 0"}}><tbody><tr>
      <td style={{width: '50%'}}>
        <DmButton text={<FaRegThumbsUp />}
        onClick={() => null}
        className="margin-top-10 button-transparent" />
      </td>
      <td style={{width: '50%'}}>
        <DmButton text={<FaCartPlus />}
        onClick={() => null}
        className="margin-top-10 button-transparent" />
      </td>
    </tr></tbody></table>);
};

export default ButtonWidget;
