# Census Guide

This is a guide to add language data from a census.

## Step 1: Find the census

Look for the appropriate census website directly -- avoid copying information from an intermediary like Wikipedia. For instance, let's take Canada. Their census website is https://www150.statcan.gc.ca/ .

Sometimes a government website is no longer available or it is only available to specific country IPs. In that case you can find the information otherwise using the Internet Archive at https://archive.org/ .

Government websites may or may not be translated into English. If the website is not originally, see if there is an option to change the website's language, otherwise you may need to use a translation service like Google Translate.

## Step 2: Find the proper table

There will be a lot of potential census data. In order to find data specific to languages want to look for "population" statistics or "culture". Once you find a table with information about languages, you may find multiple other ones that are related, such as "mother tongue", "home language", "language spoken at work", etc. You may need to look at multiple tables to get the full picture of the languages used in the country. The first table you find may not be the best. Once you have found good table or tables, write down the following characteristics:
- The name of the table (e.g., "Population by mother tongue")
- The URL for future people to check the data (e.g., https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=9810000201)
- The date the information is dated to (e.g., "2021")
- The date the information was published (e.g., "2022-02-09")

We also want to understand the precise demographic characteristcs of the people. If it isn't indicated, say "unspecified" to distinguish that from when its "any" -- eg. any ages is different than you don't know.
- The modality the language is used in ("spoken", "written", "spoken or written", "understands")
- The time learned ("mothertongue", "first language", "second language")
- The level of proficiency ("basic", "intermediate", "fluent")
- The geographic scope of the data (e.g., "whole country", "mainland -- without dependencies")
- The age of the people surveyed (e.g., "all ages", "15 years and older")

## Step 3: Process the census data

While it would be great to just copy-paste the data into a tab-separated-value (tsv) file, it is often not that easy.

**Language Codes**: In particular, most data will list names of languages -- it will be up to you to map those names to the language codes used in this project. You can find the language codes in the [public/data/languages.tsv](public/data/languages.tsv) file. Aim to find the best ISO 639-3 code but sometimes there is not a perfect match -- maybe there is a glottocode.

Sometimes a row of data from a census does not have an easy to use language code. For completeness it is good to keep that row but to use a special language code. These rows will be dropped during the import process but will be kept in the file for reference. The following codes are used for these special cases:
* `und` is used for "undetermined" languages - the common case when you don't know. For instance, multiple languages are named "Tonga" -- without additional context clues you may not know which one is meant.
* `mul` is used for "multiple languages" - such as a row that says "Indigenous languages" or "Other Languages" -- however you can use language family codes if the row corresponds to a language family like "Germanic languages".
* `mis` is used for "uncoded languages" like a dialect without an ISO code or glottocode.
* `zxx` is used for "no linguistic content" -- such as "no language" or "none".
 
If you are not sure which one to use, use `und`.

**Inferred Entries**: [Process not finalized] Iterating through the data you may realize there's only a dialect of a popular language listed (eg. High German only, not German generally) or only a language group (eg. Serbo-Croatian). In these cases, it may be important to add an artificial entry for the missing common language -- do that but also add a comment in the file noting that this is an artificial entry and why it was added.

**Language Families**: Some censuses may include language family data in addition to individual languages. For data completeness, it may be useful to include that data as well. You will have to use ISO 639-5 language family codes or glottocodes for these entries. If you need help finding the right code, it can be useful to use the Hierarchy view and use the language family in the search term. The canadian census in this regard is very helpful here since the data comes in a hierarchical form, so you can look up language codes using the tool directly, eg. http://translation-commons.github.io/lang-nav/?view=Hierarchy&searchString=atha&searchBy=English+Name+or+ID

## Step 4: Add the data to the project
Once you have the data, you can add it to the project. The data should be added to the [public/data/census](public/data/census) directory. The file should be named in the format `<country>-<year>.tsv` (e.g., `canada-2021.tsv`).
The file should be a tab-separated-value (tsv) file with the following columns:
- `language_code`: The ISO code of the language (e.g., `eng` for English).
- `language_name`: The name of the language from the census source -- important for bookkeeping in case we learn later it was mis-coded, for example Syilx (Okanagan)
- `population`: The number of people who speak the language.