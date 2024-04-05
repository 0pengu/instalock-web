import {
  Title,
  Text,
  Anchor,
  Box,
  Button,
  Container,
  Group,
  Space,
  Center,
  Stack,
} from '@mantine/core';
import classes from './Welcome.module.css';
import { Navbar } from '../Navbar/Navbar';
import { IconBrandGithub, IconBrandGithubFilled, IconBrandValorant } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Features } from '../Features/Features';

export function Welcome() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className={classes.wrapper} style={{ paddingTop: '120px' }}>
        <Container
          mx={20}
          py={300}
          px={5}
          mt={-100}
          fluid
          className={classes.inner}
          style={{
            borderRadius: '10px',
            background: 'radial-gradient(at left top, #151981, #47346D)',
          }}
        >
          <Center>
            <h1
              className={classes.title}
              style={{
                textAlign: 'center',
                paddingInline: '20px',
              }}
            >
              Welcome to{' '}
              <Text
                inherit
                variant="gradient"
                component="span"
                gradient={{ from: 'deep-red.4', to: 'deep-red' }}
              >
                Instalock
              </Text>
              , the comprehensive Valorant companion.
            </h1>
          </Center>
          <Center>
            <Group className={classes.controls}>
              <Button
                size="xl"
                className={classes.control}
                variant="gradient"
                gradient={{ from: 'purple', to: 'red' }}
                leftSection={<IconBrandValorant size={30} />}
                visibleFrom="md"
                onClick={() => {
                  navigate('/login');
                }}
              >
                Log In With Riot Credentials
              </Button>
              <Button
                component="a"
                href="https://github.com/0pengu/instalock-web"
                size="xl"
                visibleFrom="md"
                variant="default"
                className={classes.control}
                leftSection={<IconBrandGithubFilled size={30} />}
              >
                GitHub
              </Button>
            </Group>
            <Stack className={classes.control}>
              <Button
                size="xl"
                className={classes.control}
                variant="gradient"
                gradient={{ from: 'purple', to: 'red' }}
                leftSection={<IconBrandValorant size={30} />}
                hiddenFrom="md"
                onClick={() => {
                  navigate('/login');
                }}
              >
                Log In With Riot Credentials
              </Button>
              <Button
                component="a"
                href="https://github.com/0pengu/instalock-web"
                size="xl"
                hiddenFrom="md"
                variant="default"
                className={classes.control}
                leftSection={<IconBrandGithubFilled size={30} />}
              >
                GitHub
              </Button>
            </Stack>
          </Center>
        </Container>
      </div>
      <Space h={25}></Space>
      <Container mx={20} pb={50} px={5} fluid style={{ borderRadius: '10px' }}>
        <Features />
      </Container>
    </>
  );
}
