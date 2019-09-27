import { Button, Card, Result } from 'antd';
import React from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Link } from 'umi';

export default () => (
  <GridContent>
    <Card bordered={false}>
      <Result
        status="success"
        title="Заявка отправлена!"
        subTitle="Мы оповестим вас когда организация примет решение"
        style={{ marginBottom: 16, textAlign: 'center' }}
      >
        <Link to="/">
          <Button>На главную</Button>
        </Link>
      </Result>
    </Card>
  </GridContent>
);
