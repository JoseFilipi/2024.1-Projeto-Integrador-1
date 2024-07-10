#include <SPI.h>
#include <SdFat.h>
#include <Wire.h>
#include <MechaQMC5883.h>
#include <math.h>

// Pinos dos encoders
#define ENCODER_PIN_A 2
#define ENCODER_PIN_B 3

#define ENCODER_PPR 1024 // Pulsos por Rotação do Encoder
#define INTERVALO_CALCULO 1000 // Intervalo de tempo em milissegundos para cálculo da velocidade

// Variável global para armazenar o tempo de início
unsigned long startTime = 0;

// Variáveis para contagem de pulsos
volatile unsigned long pulsosMotorA = 0;
volatile unsigned long pulsosMotorB = 0;
unsigned long ultimoTempo = 0;

// Objeto da biblioteca SdFat para controle do cartão SD
SdFat sd;
// Objeto para o arquivo no cartão SD
SdFile file;

// Nome do arquivo no cartão SD
const char *fileName = "dado.txt";

// Magnetômetro
MechaQMC5883 qmc;

void startTimer() {
    startTime = millis(); // Salva o tempo atual em milissegundos
}

unsigned long getTimeElapsed() {
    return millis() - startTime; // Calcula e retorna o tempo decorrido
}

// Interrupções para contagem de pulsos
void contaPulsosMotorA() {
    // Serial.println("interrompe A");
    pulsosMotorA++;
}

void contaPulsosMotorB() {
    // Serial.println("interrompe B");
    pulsosMotorB++;
}

void setup() {
    Serial.begin(9600); // Inicializa a comunicação serial a 9600 bps

    // Inicialização dos pinos SPI manualmente (de acordo com a configuração do seu hardware)
    const int chipSelectPin = 10; // Pino do chip select do cartão SD


    

    startTimer(); // Inicia a contagem de tempo no início do programa
    ultimoTempo = millis(); // Inicializa o tempo para contagem de pulsos

    // Configuração das interrupções do encoder
    attachInterrupt(digitalPinToInterrupt(ENCODER_PIN_A), contaPulsosMotorA, RISING); // Atribua o pino correto do encoder para motor A
    attachInterrupt(digitalPinToInterrupt(ENCODER_PIN_B), contaPulsosMotorB, RISING); // Atribua o pino correto do encoder para motor B

    // Inicializa o magnetômetro
    Wire.begin();
    qmc.init();

    
    // Inicializa o cartão SD
    if (!sd.begin(chipSelectPin, SPI_HALF_SPEED)) {
        Serial.println("Falha ao inicializar o cartão SD.");
        return;
    }

    // Abre o arquivo no cartão SD para escrita
    if (!file.open(fileName, O_CREAT | O_WRITE | O_APPEND)) {
        Serial.println("Falha ao abrir o arquivo no cartão SD.");
        return;
    }
    Serial.println("Cartão SD inicializado e arquivo aberto.");
}

void loop() {
    // Leitura do magnetômetro
    int x, y, z;
    qmc.read(&x, &y, &z);
    float heading = atan2((float)y, (float)x);

    // Correção de declinação magnética (exemplo para Bytomia)
    float declinationAngle = (4.0 + (26.0 / 60.0)) / (180 / M_PI);
    heading += declinationAngle;
    if (heading < 0) heading += 2 * PI;
    if (heading > 2 * PI) heading -= 2 * PI;
    float headingDegrees = heading * 180 / M_PI;

    // Serial.print("x: ");
    // Serial.print(x);
    // Serial.print(" y: ");
    // Serial.print(y);
    // Serial.print(" heading: ");
    // Serial.print(heading);
    // Serial.print(" degrees: ");
    // Serial.println(headingDegrees);

    // Verifica se há dados disponíveis para leitura no Serial Monitor
    if (Serial.available() > 0) {
        char input = Serial.read();
        if (input == 'p') {
            Serial.println("Programa encerrado.");
            // Fecha o arquivo antes de encerrar
            file.close();
            while (true) {} // Loop infinito para manter o programa parado
        }
    }

    unsigned long tempoAtual = millis();
    if (tempoAtual - ultimoTempo >= INTERVALO_CALCULO) {
        // Calcular a frequência dos pulsos
        float freqMotorA = (float)pulsosMotorA / (INTERVALO_CALCULO / 1000.0); // pulsos por segundo
        float freqMotorB = (float)pulsosMotorB / (INTERVALO_CALCULO / 1000.0); // pulsos por segundo

        // Calcular a velocidade em RPM
        float velocidadeA = (freqMotorA * 60.0) / ENCODER_PPR;
        float velocidadeB = (freqMotorB * 60.0) / ENCODER_PPR;

        // Resetar contadores de pulsos
        pulsosMotorA = 0;
        pulsosMotorB = 0;
        ultimoTempo = tempoAtual;

        // Converte valores float para string
        char strVelocidadeA[10];
        char strVelocidadeB[10];
        char strHeading[10];
        char strHeadingDegrees[10];
        
        dtostrf(velocidadeA, 6, 2, strVelocidadeA);
        dtostrf(velocidadeB, 6, 2, strVelocidadeB);
        dtostrf(heading, 6, 2, strHeading);
        dtostrf(headingDegrees, 6, 2, strHeadingDegrees);

        // Formata os dados para escrever no arquivo no cartão SD
        char buffer[200];
        sprintf(buffer, "Tempo: %lu ms, Velocidade Motor A: %s RPM, Velocidade Motor B: %s RPM, Degrees: %s\n", getTimeElapsed(), strVelocidadeA, strVelocidadeB, strHeadingDegrees);

        // Escreve os dados no arquivo no cartão SD
        if (!file.println(buffer)) {
            Serial.println("Erro ao escrever no arquivo no cartão SD.");
        } else {
            Serial.println("Dados salvos no cartão SD.");
        }

        // Imprime os dados no Serial Monitor
        Serial.print("Tempo decorrido: ");
        Serial.print(getTimeElapsed());
        Serial.print(" ms, Velocidade Motor A: ");
        Serial.print(strVelocidadeA);
        Serial.print(" RPM, Velocidade Motor B: ");
        Serial.print(strVelocidadeB);
        Serial.print(" RPM,");
        Serial.print(" Degrees: ");
        Serial.println(strHeadingDegrees);
    }

    delay(200); // Aguarda um pouco antes de repetir o loop
}
