import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from './DataSource';
import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';
import { io } from 'socket.io-client';

const { FormField, Select } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;
type State = { devices: string[] };

export class QueryEditor extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      devices: [],
    };
  }

  onPathChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, path: event.target.value });
  };

  onBaudrateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, baudrate: parseInt(event.target.value, 10) });
    // executes the query
    onRunQuery();
  };

  onFrequencyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, frequency: parseFloat(event.target.value) });
    // executes the query
    onRunQuery();
  };

  onDeviceChange = (item: SelectableValue<string>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, device: item });
    // executes the query
    onRunQuery();
  };

  componentDidMount() {
    const path = this.props.datasource.path;
    const socket = io(path, {
      reconnectionDelayMax: 10000,
    });
    socket.on('connect', () => {
      console.log(socket.id);
    });
    socket.on('devices', (message: string[], cb: (message: string) => void) => {
      console.log(message);
      cb(`Received the data ${message.length}`);
      this.setState((state, props) => ({
        ...state,
        devices: message,
      }));
    });
  }

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { path, baudrate, frequency, device } = query;
    const options = this.state.devices.map(device => ({
      value: device,
      label: device,
      description: device,
    }));
    const selected = device || options[0];

    return (
      <div className="gf-form">
        <Select width={16} options={options} value={selected} onChange={this.onDeviceChange} />
        <FormField
          width={4}
          value={baudrate}
          onChange={this.onBaudrateChange}
          label="Baudrate"
          type="number"
          tooltip="Select the baudrate - good start is to use 9600 (Arduino UNO default)"
        />
        <FormField
          labelWidth={8}
          value={path || this.state.devices[0]}
          onChange={this.onPathChange}
          label="Device"
          tooltip="The path of the device"
        />
        <FormField labelWidth={4} value={frequency} onChange={this.onFrequencyChange} label="Frequency" type="number" />
      </div>
    );
  }
}
