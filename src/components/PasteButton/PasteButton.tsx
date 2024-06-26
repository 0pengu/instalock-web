import { Button, Center, rem, MantineThemeProvider } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form/lib/types';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';

export function PasteButton({
  form,
  highlighted,
}: {
  form: UseFormReturnType<any>;
  highlighted: boolean;
}) {
  const [pasted, setPasted] = useState(false);
  return (
    <Center pb={0}>
      <MantineThemeProvider theme={{ activeClassName: '' }}>
        <Button
          className=""
          color={form.errors.url ? 'red' : pasted ? 'green' : highlighted ? 'blue' : 'gray'}
          size="sm"
          w={40}
          onClick={async () => {
            const text = await navigator.clipboard.readText();
            form.setFieldValue('url', text);
            setPasted(true);
            setTimeout(() => {
              setPasted(false);
            }, 3000);
          }}
          rightSection={
            pasted ? (
              <Center>
                <IconCheck
                  style={{ width: rem(20), height: rem(20), marginRight: '14px' }}
                  stroke={1.5}
                />
              </Center>
            ) : (
              <Center>
                <IconCopy
                  style={{ width: rem(20), height: rem(20), marginRight: '14px' }}
                  stroke={1.5}
                />
              </Center>
            )
          }
        />
      </MantineThemeProvider>
    </Center>
  );
}
