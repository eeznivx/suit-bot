const helper = require("./index");
module.exports = {
  getPreBattle: function(group_session) {
    var flex_msg = {
      type: "flex",
      altText: "📣 Pilih Attack!",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "📣 Ronde " + group_session.round + "!",
              weight: "bold",
              size: "xl",
              wrap: true,
              color: "#feffe4"
            }
          ]
        },
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: []
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
                  color: "#fa4659",
                  action: {
                    type: "postback",
                    label: "👊",
                    data: "/attack batu"
                  }
                },
                {
                  type: "button",
                  style: "primary",
                  color: "#fa4659",
                  action: {
                    type: "postback",
                    label: "✌️",
                    data: "/attack gunting"
                  }
                },
                {
                  type: "button",
                  style: "primary",
                  color: "#fa4659",
                  action: {
                    type: "postback",
                    label: "✋",
                    data: "/attack kertas"
                  }
                }
              ]
            },
            {
              type: "box",
              layout: "horizontal",
              spacing: "md",
              contents: [
                {
                  type: "button",
                  style: "primary",
                  color: "#fa4659",
                  action: {
                    type: "uri",
                    label: "⚡ Buff 🌀",
                    uri: "line://oaMessage/@793btjtn/?/buff"
                  }
                },
              ]
            }
          ]
        },
        styles: {
          header: {
            backgroundColor: "#fa4659"
          }
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
          text: "No",
          weight: "bold",
          size: "md",
          wrap: true,
          flex: 1
        },
        {
          type: "text",
          text: "Nama",
          weight: "bold",
          size: "md",
          wrap: true,
          flex: 3
        },
        {
          type: "text",
          text: "❤️",
          weight: "bold",
          size: "md",
          wrap: true,
          flex: 1,
          align: "center"
        },
        {
          type: "text",
          text: "⚡",
          weight: "bold",
          size: "md",
          wrap: true,
          flex: 2,
          align: "center"
        }
      ]
    };

    if (group_session.mode === "team") {
      table.contents.push({
        type: "text",
        text: "🛡️",
        weight: "bold",
        size: "md",
        wrap: true,
        flex: 1,
        align: "center"
      });
    }

    let separator = {
      type: "separator",
      margin: "xs",
      color: "#fa4659"
    };

    flex_msg.contents.body.contents.push(table, separator);

    var playerTable = {};

    var num = 1;
    for (let i = 0; i < group_session.players.length; i++) {
      if (
        group_session.players[i].health > 0 &&
        group_session.players[i].attack === ""
      ) {
        playerTable[i] = {
          type: "box",
          layout: "horizontal",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "",
              size: "md",
              wrap: true,
              flex: 1
            },
            {
              type: "text",
              text: "",
              size: "md",
              wrap: true,
              flex: 3
            },
            {
              type: "text",
              text: "",
              size: "md",
              wrap: true,
              flex: 1,
              align: "center"
            },
            {
              type: "text",
              text: "",
              size: "md",
              wrap: true,
              flex: 2,
              align: "center"
            }
          ]
        };

        if (group_session.mode === "team") {
          playerTable[i].contents.push({
            type: "text",
            text: group_session.players[i].team,
            size: "md",
            wrap: true,
            flex: 1,
            align: "center"
          });
        }

        playerTable[i].contents[0].text += num;
        playerTable[i].contents[1].text += group_session.players[i].name;
        playerTable[i].contents[2].text += group_session.players[i].health;
        playerTable[i].contents[3].text += group_session.players[i].energy;
        flex_msg.contents.body.contents.push(playerTable[i]);
        num++;
      }
    }
    return flex_msg;
  },
  getPostBattle: function(group_session, detailTexts) {
    var carousel = {
      type: "carousel",
      contents: []
    };

    var bubbleResult = {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "🎌 Hasil Ronde " + group_session.round,
            weight: "bold",
            size: "xl",
            wrap: true,
            color: "#feffe4"
          }
        ]
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: []
      },
      styles: {
        header: {
          backgroundColor: "#fa4659"
        }
      }
    };

    var bubbleDetail = {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "🎌 Detail Attack",
            weight: "bold",
            size: "xl",
            wrap: true,
            color: "#feffe4"
          }
        ]
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: detailTexts
      },
      styles: {
        header: {
          backgroundColor: "#fa4659"
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
          text: "Nama",
          weight: "bold",
          size: "md",
          wrap: true,
          flex: 3
        },
        {
          type: "text",
          text: "Atk",
          weight: "bold",
          size: "md",
          wrap: true,
          flex: 3
        },
        {
          type: "text",
          text: "Attacker",
          weight: "bold",
          size: "md",
          wrap: true,
          flex: 4
        }
      ]
    };

    if (group_session.mode === "team") {
      table.contents.push({
        type: "text",
        text: "Team",
        weight: "bold",
        size: "md",
        wrap: true,
        flex: 3,
        align: "center"
      });
    }

    let separator = {
      type: "separator",
      margin: "xs",
      color: "#fa4659"
    };

    bubbleResult.body.contents.push(table, separator);

    var playerTable = {};

    for (let i = 0; i < group_session.players.length; i++) {
      if (group_session.players[i].attack !== "") {
        playerTable[i] = {
          type: "box",
          layout: "horizontal",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "",
              size: "md",
              wrap: true,
              flex: 3
            },
            {
              type: "text",
              text: "",
              size: "md",
              wrap: true,
              flex: 3
            },
            {
              type: "text",
              text: "gak ada",
              size: "md",
              wrap: true,
              flex: 4
            }
          ]
        };

        if (group_session.mode === "team") {
          playerTable[i].contents.push({
            type: "text",
            text: group_session.players[i].team,
            size: "md",
            wrap: true,
            flex: 2,
            align: "center"
          });
        }

        playerTable[i].contents[0].text += group_session.players[i].name;
        playerTable[i].contents[1].text += group_session.players[i].attack;
        if (group_session.players[i].attacker.length !== 0) {
          let attacker = group_session.players[i].attacker.join(", ");
          playerTable[i].contents[2].text = attacker;
        }
        bubbleResult.body.contents.push(playerTable[i]);
      }
    }

    carousel.contents.push(bubbleResult);

    if (detailTexts.length !== 0) {
      carousel.contents.push(bubbleDetail);
    }

    var flex_msg = {
      type: "flex",
      altText: "📣 Ada pesan untuk kamu!",
      contents: carousel
    };
    console.log(JSON.stringify(flex_msg.contents));
    return flex_msg;
  },
  getNewGame: function(group_session) {
    var flex_msg = {
      type: "flex",
      altText: "📣 Game baru telah dibuat!",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "🎮 Game baru telah dibuat",
              weight: "bold",
              size: "xl",
              wrap: true,
              color: "#feffe4"
            }
          ]
        },
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "Mode : " + group_session.mode,
              weight: "regular",
              size: "lg",
              wrap: true
            },
            {
              type: "text",
              text: "Ayok Gabung!",
              weight: "bold",
              size: "xl",
              wrap: true
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
              color: "#fa4659",
              action: {
                type: "postback",
                label: "gabung",
                data: "/join"
              }
            }
          ]
        },
        styles: {
          header: {
            backgroundColor: "#fa4659"
          }
        }
      }
    };
    return flex_msg;
  },
  getFlex: function(flex_text) {
    var flex_msg = {
      type: "flex",
      altText: "📣 Ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: flex_text.header,
              weight: "bold",
              size: "lg",
              wrap: true,
              color: "#feffe4"
            }
          ]
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: flex_text.body,
              weight: "regular",
              size: "md",
              margin: "md",
              wrap: true
            }
          ]
        },
        styles: {
          header: {
            backgroundColor: "#fa4659"
          }
        }
      }
    };
    return flex_msg;
  },
  getEndGame: function(group_session, header) {
    var flex_msg = {
      type: "flex",
      altText: "📣 Ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: header,
              weight: "bold",
              size: "xl",
              wrap: true,
              color: "#feffe4"
            }
          ]
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "Name",
                  flex: 3,
                  size: "md",
                  weight: "bold"
                },
                {
                  type: "text",
                  text: "Kill Streak",
                  flex: 4,
                  size: "md",
                  align: "center",
                  weight: "bold"
                }
              ],
              margin: "none",
              spacing: "none"
            },
            {
              type: "separator",
              margin: "none",
              color: "#fa4659"
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
              color: "#fa4659",
              action: {
                type: "postback",
                label: "main lagi",
                data: "/new"
              }
            }
          ]
        },
        styles: {
          header: {
            backgroundColor: "#fa4659"
          }
        }
      }
    };

    if (group_session.mode === "team") {
      flex_msg.contents.body.contents[0].contents.push({
        type: "text",
        text: "Team",
        weight: "bold",
        size: "md",
        wrap: true,
        flex: 2,
        align: "center"
      });
    }

    var playerTable = {};

    for (let i = 0; i < group_session.players.length; i++) {
      playerTable[i] = {
        type: "box",
        layout: "horizontal",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "",
            size: "md",
            wrap: true,
            flex: 3
          },
          {
            type: "text",
            text: "",
            size: "md",
            wrap: true,
            flex: 3,
            align: "center"
          }
        ]
      };

      if (group_session.mode === "team") {
        playerTable[i].contents.push({
          type: "text",
          text: group_session.players[i].team,
          size: "md",
          wrap: true,
          flex: 2,
          align: "center"
        });
      }

      playerTable[i].contents[0].text += group_session.players[i].name;

      if (group_session.players[i].killStreak !== 0) {
        playerTable[i].contents[1].text += group_session.players[i].killStreak;
      } else {
        playerTable[i].contents[1].text += "0";
      }

      flex_msg.contents.body.contents.push(playerTable[i]);
    }

    return flex_msg;
  },
  getPlayerList: function(group_session) {
    var flex_msg = {
      type: "flex",
      altText: "📣 Ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "📜 List Pemain",
              weight: "bold",
              size: "xl",
              wrap: true,
              color: "#feffe4"
            }
          ]
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "No",
                  flex: 1,
                  weight: "bold"
                },
                {
                  type: "text",
                  text: "Name",
                  flex: 3,
                  weight: "bold"
                },
                {
                  type: "text",
                  text: "Status",
                  flex: 3,
                  weight: "bold"
                }
              ],
              margin: "none",
              spacing: "none"
            },
            {
              type: "separator",
              margin: "none",
              color: "#fa4659"
            }
          ]
        },
        styles: {
          header: {
            backgroundColor: "#fa4659"
          }
        }
      }
    };

    if (group_session.state !== "new" && group_session.mode === "team") {
      flex_msg.contents.body.contents[0].contents.push({
        type: "text",
        text: "Team",
        flex: 2,
        weight: "bold"
      });
    }

    if (group_session.state === "new") {
      flex_msg.contents.body.contents[0].contents[2].text = "Kill";
    }

    var playerTable = {};
    let num = 1;

    for (let i = 0; i < group_session.players.length; i++) {
      playerTable[i] = {
        type: "box",
        layout: "horizontal",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "",
            size: "md",
            wrap: true,
            flex: 1
          },
          {
            type: "text",
            text: "",
            size: "md",
            wrap: true,
            flex: 3
          },
          {
            type: "text",
            text: "",
            size: "md",
            wrap: true,
            flex: 3
          }
        ]
      };

      if (group_session.state !== "new" && group_session.mode === "team") {
        playerTable[i].contents.push({
          type: "text",
          text: group_session.players[i].team,
          size: "md",
          flex: 2,
          align: "center"
        });
      }

      if (group_session.state === "new") {
        playerTable[i].contents[2].text += group_session.players[i].killAmount;
      } else {
        if (group_session.players[i].health > 0) {
          playerTable[i].contents[2].text = "survive";
        } else {
          playerTable[i].contents[2].text = "eliminated";
        }
      }

      playerTable[i].contents[0].text += num;
      playerTable[i].contents[1].text += group_session.players[i].name;

      flex_msg.contents.body.contents.push(playerTable[i]);
      num++;
    }

    if (group_session.state === "new") {
      flex_msg.contents.footer = {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#fa4659",
            action: {
              type: "postback",
              label: "gabung",
              data: "/join"
            }
          }
        ]
      };
    }

    return flex_msg;
  },
  getBuff: function() {
    var flex_msg = {
      type: "flex",
      altText: "📣 Pilih Buff!",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "🌀 Buff",
              weight: "bold",
              size: "xl",
              wrap: true,
              color: "#feffe4"
            }
          ]
        },
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "Buff dapat membantu memperkuat player, tetapi ada durasi.",
              weight: "bold",
              size: "lg",
              wrap: true
            },
          ]
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "button",
              style: "primary",
              color: "#fa4659",
              action: {
                type: "postback",
                label: "❤️ Lifesteal",
                data: "/choose lifesteal"
              }
            },
            {
              type: "button",
              style: "primary",
              color: "#fa4659",
              action: {
                type: "postback",
                label: "🎯 Enhance Damage",
                data: "/choose enhance-damage"
              }
            }
          ]
        },
        styles: {
          header: {
            backgroundColor: "#fa4659"
          }
        }
      }
    };
    return flex_msg;
  },
  getChooseBuff: function(flex_text, buff) {
    var flex_msg = {
      type: "flex",
      altText: "📣 Set Buff!",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: flex_text.header,
              weight: "bold",
              size: "xl",
              wrap: true,
              color: "#feffe4"
            }
          ]
        },
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: flex_text.body,
              weight: "regular",
              size: "md",
              wrap: true
            },
          ]
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "button",
              style: "primary",
              color: "#fa4659",
              action: {
                type: "postback",
                label: "Pilih Buff ini",
                data: "/choose " + buff + " set"
              }
            },
            {
              type: "button",
              style: "primary",
              color: "#fa4659",
              action: {
                type: "postback",
                label: "Cek Buff lain",
                data: "/choose"
              }
            }
          ]
        },
        styles: {
          header: {
            backgroundColor: "#fa4659"
          }
        }
      }
    };
    return flex_msg;
  },
};
