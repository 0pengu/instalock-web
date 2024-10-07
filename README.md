# Instalock

The Valorant companion webapp

## Description

Instalock is a webapp created with React and Express that interacts with various Riot endpoints in order to improve/augment the end user's experience.

## Getting Started

### Dependencies

- pnpm
- Windows computer with Valorant installed
  - You can run the webapp itself on any software, but you will likely need a Windows computer with a copy of Valorant in order to actually test the functionality.

### Install and run

```
git clone https://github.com/0pengu/instalock-web.git
cd instalock-web
pnpm i
```

Fill out the .env.example and rename it to .env:

```
mv .env.example .env
```

Development:

```
pnpm run dev
pnpm run server:dev
```

Production:

```
docker compose up --build -d
```

## Help

Contact me [here](mailto:tahmid@tahmid.io)
