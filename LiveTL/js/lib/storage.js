async function isNewUser(id) {
  return allTranslators.byID[id] == null;
}

async function isChecked(userid) {
  return (await getUserStatus(userid)).checked;
}

async function saveUserStatus(userid, checked, addedByUser, byname) {
  return await setStorage(`user${(byname ? 'byname' : '')}_${userid}`, { checked, addedByUser });
}

async function getUserStatus(userid, byname) {
  return (await getStorage(`user${(byname ? 'byname' : '')}_${userid}`)) || {};
}

async function getUserStatusAsBool(id) {
  let status = await getUserStatus(id);
  status = status.checked != null ? status.checked : allTranslatorCheckbox.checked;
  return status;
}

async function getDefaultLanguage() {
  let lang = await getStorage('LTL:defaultLang');
  if (lang) {
    return lang.lang;
  }
}

async function setDefaultLanguage(lang) {
  return await setStorage('LTL:defaultLang', { lang });
}

async function setDefaultSetting(setting, value) {
  if (!await getStorage(setting)) {
    return await setStorage(setting, value);
  }
}

async function setupDefaultCaption() {
  await setDefaultSetting('captionMode', true);
};

async function setupDefaultCaptionDelay() {
  await setDefaultSetting('captionDelay', -1);
};

async function getStorage(key) {
  const result = await storage.get(key);
  return result ? result[key] : result;
}

async function setStorage(key, value) {
  let obj = {}
  obj[key] = value;
  return await storage.set(obj);
}

let storage = {
  get: key => null,
  set: obj => null
};

if (isFirefox) {
  storage.get = async (key) => {
    return await browser.storage.local.get(key);
  };

  storage.set = async (obj) => {
    return await browser.storage.local.set(obj);
  };
} else if (isAndroid) {
  storage.get = async key => localStorage[key];
  storage.set = async obj => localStorage[Object.keys(obj)[0]] = obj[Object.keys(obj)[0]];
} else {
  storage.get = (key) => {
    return new Promise((res, rej) => {
      chrome.storage.local.get(key, res)
    });
  };

  storage.set = (obj) => {
    return new Promise((res, rej) => {
      chrome.storage.local.set(obj, res);
    })
  };
}

