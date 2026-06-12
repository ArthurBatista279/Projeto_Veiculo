import axios from "axios";

const API_KEY = "";

export const gerarResumo = async (dados, descricaoAdicional = "") => {
  let prompt = "";
  
  if (typeof dados === "object" && dados !== null) {
    const {
      nome, titulo, marca, modelo, ano, preco, cor,
      quilometragem, combustivel, cambio,
      numeroPortas, portas, potencia, capacidadePassageiros, passageiros
    } = dados;

    const nomeVeiculo = nome || titulo || "Não especificado";
    const numPortas = numeroPortas || portas || "Não especificado";
    const capPassageiros = capacidadePassageiros || passageiros || "Não especificado";
    
    prompt = `Você é um assistente especialista em vendas de carros e marketing digital.
Gere uma descrição profissional, atraente e detalhada para um anúncio de venda de veículo com as seguintes especificações:
- Nome/Título: ${nomeVeiculo}
- Marca: ${marca || "Não especificada"}
- Modelo: ${modelo || "Não especificado"}
- Ano: ${ano || "Não especificado"}
- Preço: ${preco || "Sob consulta"}
- Cor: ${cor || "Não especificada"}
- Quilometragem: ${quilometragem || "0"} km
- Combustível: ${combustivel || "Não especificado"}
- Câmbio: ${cambio || "Não especificado"}
- Portas: ${numPortas}
- Potência: ${potencia || "Não especificada"}
- Passageiros: ${capPassageiros}

${descricaoAdicional ? `Observações adicionais para incluir no texto: ${descricaoAdicional}` : ""}

Por favor, crie um texto corrido, altamente persuasivo para vendas, destacando o conforto, o design e o custo-benefício do veículo de forma profissional e direta.`;
  } else {
    prompt = `Faça um resumo simples e direto para:
Título: ${dados}
${descricaoAdicional ? `Descrição/Detalhes adicionais: ${descricaoAdicional}` : ""}

Caso seja um veículo, faça uma descrição curta de venda. Caso seja um filme, faça uma sinopse/resumo curto.`;
  }

  try {
    const resposta = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return resposta.data.choices[0].message.content;
  } catch (erro) {
    console.error("Erro na requisição da IA:", erro);
    return "Erro ao gerar resumo/descrição via IA. Verifique se a sua chave de API é válida.";
  }
};