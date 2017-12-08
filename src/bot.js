const SOFA = require('sofa-js');

const Bot = require('./lib/Bot');
const Fiat = require('./lib/Fiat');

// States

const STATES = {
  welcome: 'WELCOME',
  waiting: 'WAITING',
  questionDisplayed: 'QUESTION_DISPLAYED',
  questionAnswered: 'QUESTION_ANSWERED',
  URLawaiting: 'URL_AWAITING',
  URLreceived: 'URL_RECEIVED',
  URLsent: 'URL_SENT'
};

let bot = new Bot();

// Routing

bot.onEvent = function(session, message) {
  switch (message.type) {
    case 'Init':
      welcome(session);
      break;
    case 'Message':
      onMessage(session, message);
      break;
    case 'Command':
      onCommand(session, message);
      break;
    case 'Payment':
      onPayment(session, message);
      break;
    case 'PaymentRequest':
      onPaymentRequest(session);
      break;
  }
};

// Routes

function welcome(session) {
  session.set('app_state', STATES.waiting);
  sendKnowMore(
    session,
    `Hey ${
      session.user.custom.name
    }, welcome to FakeSlam!\n\nWe'll send you news articles daily, and you have to identify the fake ones.\n\nResearch and back your vote with some ETH. Get rewarded if you're correct!`
  );
}

function onMessage(session, message) {
  if (session.get('app_state') == STATES.URLsent) {
    // Get url from the user and send it to the DB
    session.reply(
      `We have recieved your link: ${
        message.content.body
      }\n\nFakeSlam! will circulate this among users, and will make you aware of the outcome as soon as possible. To complete the submission, just cast your vote. Thanks!`
    );
    session.set('app_state', STATES.URLreceived);
    sendQuestion(session, message.content.body);
    session.set('app_state'), STATES.waiting;
  } else if (session.get('app_state') == STATES.waiting) {
    handlePushNewQuestion(
      session,
      `Man develops a dating app exclusively for mechanical engineers; receives a million downloads in few hours\n\nhttp://www.fakingnews.firstpost.com/society/man-develops-dating-app-exclusively-mechanical-engineers-receives-700-traffic-first-week-24314`
    );
  } else if (message.content.body.includes('send')) {
    handlePushNewQuestion(
      session,
      `Man develops a dating app exclusively for mechanical engineers; receives a million downloads in few hours\n\nhttp://www.fakingnews.firstpost.com/society/man-develops-dating-app-exclusively-mechanical-engineers-receives-700-traffic-first-week-24314`
    );
  } else {
    welcome(session);
  }
}

function onCommand(session, command) {
  switch (command.content.value) {
    case 'more':
      handleMoreTap(session);
      break;
    case 'okay':
      handleOkayTap(session);
      break;
    case 'answerFake':
      handleAnswerTap(session, 'FAKE');
      break;
    case 'answerGenuine':
      handleAnswerTap(session, 'GENUINE');
      break;
    case 'answerSkip':
      handleAnswerTap(session, 'SKIP');
      break;
    case 'pushNewQuestion':
      handlePushNewQuestion(
        session,
        `Man develops a dating app exclusively for mechanical engineers; receives a million downloads in few hours\n\nhttp://www.fakingnews.firstpost.com/society/man-develops-dating-app-exclusively-mechanical-engineers-receives-700-traffic-first-week-24314`
      );
      break;
    case 'addNewQuestion':
      session.set('app_state', STATES.URLawaiting);
      session.reply(`Post a link to the news article you wish to be predicted using FakeSlam!`);
      session.set('app_state', STATES.URLsent);
      break;
    case 'reviewQuestion':
      handlePushNewQuestion(
        session,
        `Man develops a dating app exclusively for mechanical engineers; receives a million downloads in few hours\n\nhttp://www.fakingnews.firstpost.com/society/man-develops-dating-app-exclusively-mechanical-engineers-receives-700-traffic-first-week-24314`
      );
      d;
      break;
    case 'backWith100':
      executeTx(session, 100);
      break;
    case 'backWith200':
      executeTx(session, 200);
      break;
  }
}

function onPayment(session, message) {
  if (message.fromAddress == session.config.paymentAddress) {
    // handle payments sent by the bot
    if (message.status == 'confirmed') {
      // perform special action once the payment has been confirmed
      // on the network
    } else if (message.status == 'error') {
      // oops, something went wrong with a payment we tried to send!
    }
  } else {
    // handle payments sent to the bot
    if (message.status == 'unconfirmed') {
      // payment has been sent to the ethereum network, but is not yet confirmed
      session.reply(`Thanks for the payment! Please await confirmation.`);
    } else if (message.status == 'confirmed') {
      // handle when the payment is actually confirmed!
      session.reply(`Received. Payment Sucessful.`);
    } else if (message.status == 'error') {
      sendMessage(session, `There was an error with your payment!🚫`);
    }
  }
}

function onPaymentRequest(session, message) {
  session.reply(`Help us identify fake news and get rewarded!`);
}

function count(session) {
  // let count = (session.get('count') || 0) newQuestion 1;
  session.set('count', count);
  sendMessage(session, `${count}`);
}

// Command Handlers

function handleOkayTap(session) {
  session.set('app_state', STATES.waiting);
  session.reply(`We'll let you know when there is fake news to be detected. Thanks.`);
}

function handleMoreTap(session) {
  session.set('app_state', STATES.waiting);
  session.reply(`TODO: This will be descriptive in near future`);
}

function handlePushNewQuestion(session, question) {
  sendQuestion(session, question);
}

function handleAnswerTap(session, mark) {
  session.set('app_state', STATES.questionAnswered);
  if (mark === 'SKIP') {
    session.reply(`Question skipped. Do vote when next question arrives.`);
  } else {
    backWithControls(session);
  }
}

function executeTx(session, amount) {
  Fiat.fetch()
    .then(toEth => {
      session.requestEth(toEth.INR(amount));
    })
    .catch(error => {
      session.reply(`Sorry, something went wrong while I was looking up exchange rates.`);
    });
}

// Helpers

/**
 * The bot replies with buttons: 'Know More' and 'Okay'
 */
function sendKnowMore(session, message) {
  let controls = [
    { type: 'button', label: 'Review a Post', value: 'reviewQuestion' },
    { type: 'button', label: 'Add a Post', value: 'addNewQuestion' },
    { type: 'button', label: 'Know More', value: 'more' },
    { type: 'button', label: 'Okay', value: 'okay' }
  ];
  session.reply(
    SOFA.Message({
      body: message,
      controls: controls,
      showKeyboard: false
    })
  );
}

/**
 * The bot sends a question to identify as either fake or genuine
 */
function sendQuestion(session, question) {
  let controls = [
    { type: 'button', label: 'Fake', value: 'answerFake' },
    { type: 'button', label: 'Genuine', value: 'answerGenuine' },
    { type: 'button', label: 'Skip', value: 'answerSkip' }
  ];
  session.reply(
    SOFA.Message({
      body: question + "\n\nNote that you won't be able to edit your reponse once submitted.",
      controls: controls,
      showKeyboard: false
    })
  );
}

function backWithControls(session) {
  let controls = [
    { type: 'button', label: '₹100', value: 'backWith100' },
    { type: 'button', label: '₹200', value: 'backWith200' }
  ];
  session.reply(
    SOFA.Message({
      body: 'Select the amount you would like to back your vote with:',
      controls: controls,
      showKeyboard: false
    })
  );
}
