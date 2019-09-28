import Link from 'umi/link';
import { Result, Button } from 'antd';
import React from 'react';

export default () => (
  <Result
    status="403"
    title="Плак, 403"
    style={{
      background: 'none',
    }}
    subTitle="У вас нет доступа к этой страничке"
    extra={
      <Link to="/">
        <Button type="primary">На главную</Button>
      </Link>
    }
  />
);
