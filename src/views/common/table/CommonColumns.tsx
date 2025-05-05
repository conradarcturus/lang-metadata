import { ObjectData } from '../../../DataTypes';
import Highlightable from '../../../generic/Highlightable';
import { getObjectName } from '../getObjectName';
import HoverableObject from '../HoverableObject';

import { TableColumn } from './ObjectTable';

export const CodeColumn: TableColumn<ObjectData> = {
  label: 'Code',
  render: (object) => <Highlightable str={object.code} match="codeFilter" />,
};

export const NameColumn: TableColumn<ObjectData> = {
  label: 'Name',
  render: (object) => <Highlightable str={getObjectName(object)} match="nameFilter" />,
};

export const InfoButtonColumn: TableColumn<ObjectData> = {
  label: 'Info',
  render: (object) => (
    <HoverableObject object={object}>
      <button className="InfoButton">&#x24D8;</button>
    </HoverableObject>
  ),
};
