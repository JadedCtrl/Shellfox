document.getElementsByTagName("html")[0].setAttribute("lang", browser.i18n.getMessage("@@ui_locale"));

document.getElementById("errorPageTitle").innerText = browser.i18n.getMessage("errorPageTitle");
document.getElementById("errorTitle").innerText = browser.i18n.getMessage("errorTitle");
document.getElementById("notInstalled").innerText = browser.i18n.getMessage("errorNotInstalled");
document.getElementById("notInstalledDesc").innerHTML = browser.i18n.getMessage("errorNotInstalledDesc");

document.getElementById("installTitle").innerText = browser.i18n.getMessage("repairInstallTitle");
document.getElementById("installIntro").innerText = browser.i18n.getMessage("repairInstallIntro");
document.getElementById("installStep1").innerHTML = browser.i18n.getMessage("repairInstallStep1");
document.getElementById("installStep2").innerHTML = browser.i18n.getMessage("repairInstallStep2");
document.getElementById("installStep3").innerHTML = browser.i18n.getMessage("repairInstallStep3");
document.getElementById("installStep4").innerHTML = browser.i18n.getMessage("repairInstallStep4");
document.getElementById("installStep5").innerText = browser.i18n.getMessage("repairInstallStep5");
document.getElementById("installTerminalIntro").innerText = browser.i18n.getMessage("repairInstallTerminalIntro");

document.getElementById("zip_link").setAttribute("href", "https://hak.xwx.moe/jadedctrl/shellfox/archive/master.zip");
