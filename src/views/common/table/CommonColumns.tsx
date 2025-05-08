import Highlightable from '../../../generic/Highlightable';
import { ObjectData } from '../../../types/DataTypes';
import { SortBy } from '../../../types/PageParamTypes';
import { getObjectName } from '../getObjectName';
import HoverableObject from '../HoverableObject';

import { TableColumn } from './ObjectTable';

export const CodeColumn: TableColumn<ObjectData> = {
  label: 'Code',
  render: (object) => <Highlightable str={object.code} match="codeFilter" />,
  sortParam: SortBy.Code,
};

export const NameColumn: TableColumn<ObjectData> = {
  label: 'Name',
  render: (object) => <Highlightable str={getObjectName(object)} match="nameFilter" />,
  sortParam: SortBy.Name,
};

export const InfoButtonColumn: TableColumn<ObjectData> = {
  label: 'Info',
  render: (object) => (
    <HoverableObject object={object}>
      <button className="InfoButton">&#x24D8;</button>
    </HoverableObject>
  ),
};
