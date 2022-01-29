import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import supabaseClient from "../services/supabase";
import MoreDetails from "../components/moreDetails/indexMoreDetails";
import { useRouter } from "next/router";
import { ButtonSendSticker } from "../components/ButtonSendStickers/indexButtonSendStickers";

const tableName = "mensagens";

function escutaMensagensEmTempoReal(adicionaMensagem) {
  return supabaseClient
    .from(tableName)
    .on("INSERT", (response) => {
      adicionaMensagem(response.new);
    })
    .subscribe();
}

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState("");
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
  const roteamento = useRouter();
  const userName = roteamento.query.username;

  React.useEffect(() => {
    supabaseClient
      .from(tableName)
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setListaDeMensagens(data);
      });

    escutaMensagensEmTempoReal((novaMensagem) => {
      setListaDeMensagens((valorAtualDaLista) => {
        return [novaMensagem, ...valorAtualDaLista];
      });
    });
  }, []);

  function handleNovaMensagem(novaMensagem) {
    if (novaMensagem.trim() !== "") {
      const mensagem = {
        de: userName,
        texto: novaMensagem,
      };

      supabaseClient.from(tableName).insert(mensagem).then();

      setMensagem("");
    }
  }

  function handleApagarMensagem(idMensagem) {
    supabaseClient
      .from(tableName)
      .delete()
      .match({ id: idMensagem })
      .then(({ data }) =>
        setListaDeMensagens((prev) => prev.filter((el) => el.id !== data[0].id))
      );
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary["900"],
        backgroundImage:
          "url(https://live.staticflickr.com/65535/51844720015_91dadafd38_k.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList
            mensagens={listaDeMensagens}
            deletarMensagem={handleApagarMensagem}
          />

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Button
              colorVariant="positive"
              variant="secondary"
              label="Enviar"
              rounded="md"
              size="lg"
              styleSheet={{
                padding: "6px 8px",
                marginRight: "8px",
              }}
              onClick={() => {
                handleNovaMensagem(mensagem);
              }}
            />
            <ButtonSendSticker
              onStickerClick={(sticker) => {
                handleNovaMensagem(`:sticker:${sticker}`);
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  const [moreDetails, setMoreDetails] = React.useState({
    userName: "",
    state: false,
    alignX: "0",
    alignY: "0",
  });

  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem, idx) => {
        return (
          <Text
            key={idx}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                display: "flex",
                marginBottom: "8px",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Image
                  id="imageAccount"
                  styleSheet={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    display: "inline-block",
                    position: "relative",
                    marginRight: "8px",
                  }}
                  src={`https://github.com/${mensagem.de}.png`}
                  onMouseOver={(event) => {
                    setMoreDetails({
                      userName: mensagem.de,
                      state: true,
                      alignX: event.target.offsetLeft + 22,
                      alignY: event.target.offsetTop,
                    });
                  }}
                />

                {moreDetails.state ? (
                  <MoreDetails
                    moreDetails={moreDetails}
                    cbCloseMoreDetail={setMoreDetails}
                  />
                ) : null}
                <Text tag="strong">{mensagem.de}</Text>
                <Text
                  styleSheet={{
                    fontSize: "10px",
                    marginLeft: "8px",
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag="span"
                >
                  {new Date().toLocaleDateString()}
                </Text>
              </Box>
              <button
                style={{
                  width: "15px",
                  height: "15px",
                  background: "red",
                  color: "white",
                  cursor: "pointer",
                  border: "none",
                }}
                onClick={() => {
                  props.deletarMensagem(mensagem.id);
                }}
              >
                X
              </button>
            </Box>
            {mensagem.texto.startsWith(":sticker:") ? (
              <Image
                styleSheet={{ maxWidth: "130px" }}
                src={mensagem.texto.replace(":sticker:", "")}
              />
            ) : (
              mensagem.texto
            )}
          </Text>
        );
      })}
    </Box>
  );
}
