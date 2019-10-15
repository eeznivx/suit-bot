const client = require("../src/client");
module.exports = {
  text: function(event, texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
      event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  },
  regularFlex: function(event, flex_text) {
    var flex_msg = {
      type: "flex",
      altText: "ada pesan untuk kamu!",
      contents: {}
    };

    if (Array.isArray(flex_text)) {
      flex_msg.contents = {
        type: "carousel",
        contents: []
      };

      var bubble = {};
      for (let i = 0; i < flex_text.length; i++) {
        bubble[i] = {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            spacing: "md",
            contents: [
              {
                type: "text",
                text: flex_text[i].header,
                size: "lg",
                weight: "bold"
              },
              {
                type: "text",
                text: flex_text[i].body,
                wrap: true,
                size: "xs"
              }
            ]
          }
        };

        flex_msg.contents.contents.push(bubble[i]);
      }
    } else {
      flex_msg.contents = {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: flex_text.header,
              size: "lg",
              weight: "bold"
            },
            {
              type: "text",
              text: flex_text.body,
              wrap: true,
              size: "xs"
            }
          ]
        }
      };
    }

    return client.replyMessage(event.replyToken, flex_msg).catch(err => {
      console.log(err.originalError.config.data);
    });
  },
  newGameFlex: function(event, group_session) {
    var flex_msg = {
      type: "flex",
      altText: "ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "Game baru telah dibuat!",
              weight: "bold",
              size: "xl",
              wrap: true
            },
            {
              type: "text",
              text: "Mode : " + group_session.mode,
              wrap: true,
              weight: "bold",
              size: "xs"
            }
          ]
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              style: "primary",
              action: {
                type: "postback",
                label: "gabung",
                data: "/join"
              }
            }
          ]
        }
      }
    };
    return client.replyMessage(event.replyToken, flex_msg).catch(err => {
      console.log(err.originalError.config.data);
    });
  },
  preBattleFlex: function(event, group_session) {
    var flex_msg = {
      type: "flex",
      altText: "ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "Pilih Attackmu!",
              weight: "bold",
              size: "xl",
              wrap: true
            }
          ]
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              spacing: "md",
              contents: [
                {
                  type: "button",
                  style: "primary",
                  action: {
                    type: "postback",
                    label: "batu",
                    data: "/attack batu"
                  }
                },
                {
                  type: "button",
                  style: "primary",
                  action: {
                    type: "postback",
                    label: "gunting",
                    data: "/attack gunting"
                  }
                }
              ]
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "button",
                  style: "primary",
                  action: {
                    type: "postback",
                    label: "kertas",
                    data: "/attack kertas"
                  }
                }
              ]
            }
          ]
        }
      }
    };

    var table = {
      type: "box",
      layout: "horizontal",
      spacing: "md",
      contents: [
        {
          type: "text",
          text: "No.",
          weight: "bold",
          size: "md",
          wrap: true
        },
        {
          type: "text",
          text: "Nama",
          weight: "bold",
          size: "md",
          wrap: true
        },
        {
          type: "text",
          text: "Health",
          weight: "bold",
          size: "md",
          wrap: true
        }
      ]
    };
    flex_msg.contents.body.contents.push(table);

    var playerTable = {};

    var num = 1;
    for (let i = 0; i < group_session.players.length; i++) {
      if (group_session.players[i].health > 0) {
        playerTable[i] = {
          type: "box",
          layout: "horizontal",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "",
              size: "md",
              wrap: true
            },
            {
              type: "text",
              text: "",
              size: "md",
              wrap: true
            },
            {
              type: "text",
              text: "",
              size: "md",
              wrap: true
            }
          ]
        };

        playerTable[i].contents[0].text += num;
        playerTable[i].contents[1].text += group_session.players[i].name;
        playerTable[i].contents[2].text += group_session.players[i].health;
        flex_msg.contents.body.contents.push(playerTable[i]);
        num++;
      }
    }
    return flex_msg
    // return client.replyMessage(event.replyToken, flex_msg).catch(err => {
    //   console.log(err.originalError.config.data);
    // });
  },
  postBattleFlex: function(event, group_session) {
    var flex_msg = {
      type: "flex",
      altText: "ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "Pilih Attackmu!",
              weight: "bold",
              size: "xl",
              wrap: true
            }
          ]
        }
      }
    };

    var table = {
      type: "box",
      layout: "horizontal",
      spacing: "md",
      contents: [
        {
          type: "text",
          text: "No.",
          weight: "bold",
          size: "md",
          wrap: true
        },
        {
          type: "text",
          text: "Nama",
          weight: "bold",
          size: "md",
          wrap: true
        },
        {
          type: "text",
          text: "Attack",
          weight: "bold",
          size: "md",
          wrap: true
        },
        {
          type: "text",
          text: "Attacker",
          weight: "bold",
          size: "md",
          wrap: true
        },
      ]
    };
    flex_msg.contents.body.contents.push(table);

    var playerTable = {};

    var num = 1;
    for (let i = 0; i < group_session.players.length; i++) {
      if (group_session.players[i].attackResult !== ""){
        playerTable[i] = {
        type: "box",
        layout: "horizontal",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "",
            size: "md",
            wrap: true
          },
          {
            type: "text",
            text: "",
            size: "md",
            wrap: true
          },
          {
            type: "text",
            text: "",
            size: "md",
            wrap: true
          },
          {
            type: "text",
            text: "",
            size: "md",
            wrap: true
          }
        ]
      };

      playerTable[i].contents[0].text += num;
      playerTable[i].contents[1].text += group_session.players[i].name;
      playerTable[i].contents[2].text += group_session.players[i].attackResult;
      playerTable[i].contents[3].text += group_session.players[i].attacker.join();
      flex_msg.contents.body.contents.push(playerTable[i]);
      num++;
      }
    }

    // return client.replyMessage(event.replyToken, flex_msg).catch(err => {
    //   console.log(err.originalError.config.data);
    // });
    return flex_msg;
  }
};
