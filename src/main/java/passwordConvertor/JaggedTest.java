package passwordConvertor;

import com.exceptionfactory.jagged.DecryptingChannelFactory;
import com.exceptionfactory.jagged.EncryptingChannelFactory;
import com.exceptionfactory.jagged.RecipientStanzaReader;
import com.exceptionfactory.jagged.RecipientStanzaWriter;
import com.exceptionfactory.jagged.framework.stream.StandardDecryptingChannelFactory;
import com.exceptionfactory.jagged.framework.stream.StandardEncryptingChannelFactory;
import com.exceptionfactory.jagged.x25519.X25519KeyFactory;
import com.exceptionfactory.jagged.x25519.X25519KeyPairGenerator;
import com.exceptionfactory.jagged.x25519.X25519RecipientStanzaReaderFactory;
import com.exceptionfactory.jagged.x25519.X25519RecipientStanzaWriterFactory;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.channels.WritableByteChannel;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.time.Instant;
import java.util.Base64;
import java.util.Collections;

import static java.nio.file.StandardOpenOption.CREATE;
import static java.nio.file.StandardOpenOption.WRITE;

public class JaggedTest {

    public static void main(String[] args) {
        try {
            final KeyPairGenerator generator = new X25519KeyPairGenerator();
            final KeyPair keyPair = generator.generateKeyPair();

            System.out.println("# created: " + Instant.now());
            System.out.println("# public key: " + keyPair.getPublic());
            System.out.println(keyPair.getPrivate());

            byte[] publicKeyBytes = keyPair.getPublic().getEncoded();
            final CharSequence publicKey = Base64.getEncoder().encodeToString(publicKeyBytes);
            RecipientStanzaWriter recipientStanzaWriter = X25519RecipientStanzaWriterFactory.newRecipientStanzaWriter(publicKey);

            EncryptingChannelFactory channelFactory = new StandardEncryptingChannelFactory();

//                      String writing

            String plaintext = "hello";
            byte[] inputData = plaintext.getBytes();

            ByteArrayInputStream inputStream = new ByteArrayInputStream(inputData);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            ReadableByteChannel inputChannel = Channels.newChannel(inputStream);
            WritableByteChannel outputChannel = channelFactory.newEncryptingChannel(
                    Channels.newChannel(outputStream),
                    Collections.singletonList(recipientStanzaWriter)
            );

            ByteBuffer buffer = ByteBuffer.allocate(65536);
            while ( inputChannel.read(buffer) != -1 ) {
                buffer.flip();
                while (buffer.hasRemaining()){
                    outputChannel.write(buffer);
                }
                buffer.clear();
            }

            outputChannel.close();
            inputChannel.close();

            byte[] encryptedBytes = outputStream.toByteArray();
            String encryptedBase64 = Base64.getEncoder().encodeToString(encryptedBytes);

            System.out.println(encryptedBase64);

//            Decrpt

            RecipientStanzaReader decryptReader = X25519RecipientStanzaReaderFactory.newRecipientStanzaReader(keyPair.getPrivate().getFormat());
            final DecryptingChannelFactory decryptingChannelFactory = new StandardDecryptingChannelFactory();

            ByteArrayInputStream decryptInputStream = new ByteArrayInputStream(encryptedBytes);
            ByteArrayOutputStream decryptOutputStream = new ByteArrayOutputStream();

            ReadableByteChannel decryptInputChannel = decryptingChannelFactory.newDecryptingChannel(
                    Channels.newChannel(decryptInputStream),
                    Collections.singletonList(decryptReader)
            );
            outputChannel = Channels.newChannel(decryptOutputStream);

            buffer = ByteBuffer.allocate(65552);
            while ( decryptInputChannel.read(buffer) != -1 ) {
                buffer.flip();
                while (buffer.hasRemaining()) {
                    outputChannel.write(buffer);
                }
                buffer.clear();
            }



            byte[] decryptBytes = decryptOutputStream.toByteArray();
            String decryptData = new String(decryptBytes, StandardCharsets.UTF_8);

            System.out.println("Decrypted String: " + decryptData);


//                      File Writing

//            final Path inputPath = Paths.get("data");
//            final Path outputPath = Paths.get("data.age");
//
//            final ReadableByteChannel inputChannel = Files.newByteChannel(inputPath);
//            final WritableByteChannel encrptingChannel = channelFactory.newEncryptingChannel(
//                    Files.newByteChannel(outputPath,CREATE,WRITE),
//                    Collections.singletonList(recipientStanzaWriter)
//            );
//            final ByteBuffer buffer = ByteBuffer.allocate(65536);
//            while ( inputChannel.read(buffer) != -1 ) {
//                buffer.flip();
//                while (buffer.hasRemaining()){
//                    encrptingChannel.write(buffer);
//                }
//                buffer.clear();
//            }
//            buffer.flip();
//            while ( buffer.hasRemaining() ) {
//                encrptingChannel.write(buffer);
//            }

        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
    }

}
