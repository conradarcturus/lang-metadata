import Highlightable from '../../../generic/Highlightable';
import { ObjectData } from '../../../types/DataTypes';
import { SearchBy, SortBy } from '../../../types/PageParamTypes';
import HoverableObject from '../HoverableObject';

import { TableColumn } from './ObjectTable';

export const CodeColumn: TableColumn<ObjectData> = {
  label: 'Code',
  render: (object) => <Highlightable object={object} field={SearchBy.Code} />,
  sortParam: SortBy.Code,
};

export const NameColumn: TableColumn<ObjectData> = {
  label: 'Name',
  render: (object) => <Highlightable object={object} field={SearchBy.Name} />,
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
