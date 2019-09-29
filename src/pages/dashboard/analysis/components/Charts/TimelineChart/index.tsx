import { Axis, Chart, Geom, Legend, Tooltip } from 'bizcharts';

import DataSet from '@antv/data-set';
import React from 'react';
import Slider from 'bizcharts-plugin-slider';
import autoHeight from '../autoHeight';
import styles from './index.less';

export interface TimelineChartProps {
  data: {
    x: number;
    y: number;
  }[];
  title?: string;
  titleMap: { y: string };
  padding?: [number, number, number, number];
  height?: number;
  style?: React.CSSProperties;
  borderWidth?: number;
}

const TimelineChart: React.FC<TimelineChartProps> = props => {
  const {
    title,
    height = 400,
    padding = [60, 20, 40, 40] as [number, number, number, number],
    titleMap = {
      y: 'y',
    },
    borderWidth = 2,
    data: sourceData,
  } = props;

  const data = Array.isArray(sourceData) ? sourceData : [{ x: 0, y: 0 }];

  data.sort((a, b) => a.x - b.x);

  let max;
  if (data[0] && data[0].y) {
    max = Math.max([...data].sort((a, b) => b.y - a.y)[0].y);
  }

  const ds = new DataSet({
    state: {
      start: data[0].x,
      end: data[data.length - 1].x,
    },
  });

  const dv = ds.createView();
  dv.source(data)
    .transform({
      type: 'filter',
      callback: (obj: { x: string }) => {
        const date = obj.x;
        return date <= ds.state.end && date >= ds.state.start;
      },
    })
    .transform({
      type: 'map',
      callback(row: { y: string }) {
        const newRow = { ...row };
        newRow[titleMap.y] = row.y;
        return newRow;
      },
    })
    .transform({
      type: 'fold',
      fields: [titleMap.y], // 展开字段集
      key: 'key', // key字段
      value: 'value', // value字段
    });

  const timeScale = {
    type: 'time',
    tickInterval: 60 * 60 * 1000,
    mask: 'HH:mm',
    range: [0, 1],
  };

  const cols = {
    x: timeScale,
    value: {
      max,
      min: 0,
    },
  };

  const SliderGen = () => (
    <Slider
      padding={[0, padding[1] + 20, 0, padding[3]]}
      width="auto"
      height={26}
      xAxis="x"
      yAxis="y"
      scales={{ x: timeScale }}
      data={data}
      start={ds.state.start}
      end={ds.state.end}
      backgroundChart={{ type: 'line' }}
      onChange={({ startValue, endValue }: { startValue: string; endValue: string }) => {
        ds.setState('start', startValue);
        ds.setState('end', endValue);
      }}
    />
  );

  return (
    <div className={styles.timelineChart} style={{ height: height + 30 }}>
      <div>
        {title && <h4>{title}</h4>}
        <Chart height={height} padding={padding} data={dv} scale={cols} forceFit>
          <Axis name="x" />
          <Tooltip />
          <Legend name="key" position="top" />
          <Geom type="line" position="x*value" size={borderWidth} color="key" />
        </Chart>
        <div style={{ marginRight: -20 }}>
          <SliderGen />
        </div>
      </div>
    </div>
  );
};

export default autoHeight()(TimelineChart);
