# Language Metadata

This repository will contain a dataset of metadata about the world's languages and language-like objects as well as a website framework to visualize the information.


![Preview of the website](/public/preview.png)

## Data

The data comes from multiple sources, primarily [CLDR](https://github.com/unicode-org/cldr/), [Ethnologue](https://www.ethnologue.com/), and [Glottolog](https://glottolog.org/).

## Functionality

Here's a list of planned functionality. Completed functions are checked off.

- [x] Language-adjacent objects
  - [x] Languages
    - [x] Core attributes
    - [x] ISO parent/child connections
    - [x] Language families
    - [x] Glottolog
    - [ ] Digital Support details
  - [x] Territories
    - [x] Countries & Dependencies
    - [ ] Continents & other regions - _in progress_
  - [x] Locales (languages + territories + potentially other specificity)
    - [x] Basic data
    - [ ] Population estimate sources
  - [x] Writing Systems
    - [x] Basic data
    - [x] Relationship w/ other writing systems (containment, lineage)
  - [ ] Language Variants / IANA tags
- [x] Views
  - [x] Cards
  - [x] Details
  - [x] Hierarchy
  - [ ] Table
  - [ ] Map
- [x] Interactivity
  - [x] Filter
    - [x] By Code
    - [x] By Name
    - [x] Highlight search
    - [ ] Using typeahead
  - [x] Hovercard & Tooltips
    - [x] Related objects
    - [ ] Field explanations
  - [x] Sort By: Population, Name, Code
  - [x] Limit
  - [ ] Selection
  - [ ] Export
- [ ] Manage data sources
  - [x] Load different subsets of data
  - [ ] Show results based on different definitions of what a language is - _in progress_
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
