# Language Metadata

This repository will contain a dataset of metadata about the world's languages and language-like objects as well as a website framework to visualize the information.


![Preview of the website](/public/preview.png)

## Data

The data comes from multiple sources, primarily [CLDR](https://github.com/unicode-org/cldr/), [Ethnologue](https://www.ethnologue.com/), and [Glottolog](https://glottolog.org/).

## Functionality

Here's a list of planned functionality. Completed functions are checked off.

- [ ] Language-adjacent objects
  - [x] Languages
    - [x] Core attributes
    - [x] ISO parent/child connections
    - [ ] Glottolog
    - [ ] Digital Support details
  - [x] Territories
  - [ ] Locales (languages + territories + potentially other specificity)
  - [ ] Writing Systems
  - [ ] Language Variants / IANA tags
- [ ] Views
  - [x] Cards
  - [x] Details
  - [ ] Hierarchy
  - [ ] Table
  - [ ] Map
- [ ] Interactivity
  - [ ] Filter
    - [x] By Code
    - [x] By Name
    - [ ] Using typeahead
  - [ ] Hovercard & Tooltips
    - [x] Related objects
    - [ ] Field explanations
  - [ ] Sort
    - [ ] By Population
    - [ ] By Name
  - [ ] Selection
  - [ ] Export
- [ ] Manage data sources
  - [ ] Load different subsets of data
  - [ ] Show results based on different definitions of what a language is
    - [ ] ISO Languages, Macrolanguages, and Language Families
    - [ ] Glottolog Languoids
    - [ ] Inclusive
- [ ] Future ideas
  - [ ] Database-powered backend
  - [ ] Feedback mechanisms
  - [ ] Validation & warnings 

# How to use

The website runs on React + Typescript.

## Instructions

Start the server using `npm run dev`

## Initialize

This project was created using Node and Vite. ChatGPT helped a lot when starting out the project. Let me know if I over-initialized anything.

1. Install npm
2. Initalize the project using vite `npm create vite@latest`
  1. Choose `lang-metadata` as project name. Then React + TypeScript
3. Change into the `lang-metadata` directory and run `npm install`
4. Setup the linter
  1. Initialize `npx eslint --init`
  2. Choose options: what: javascript, use: problems, modules: esm, framework: react, typescript: yes, runs on: browser
  3. `npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier`
  4. More magic to get it to run... I had to install ESLint on my IDE (VSCode)
  5. Some plugins were added after the this library was started like `eslint-plugin-import`
5. Import other lirbaries
   1. `npm install react-router-dom`
6. Start `npm run dev`
