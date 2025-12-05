import leoProfanity from 'leo-profanity';

const censorFilter = (word) => leoProfanity.clean(word);

export default censorFilter;
