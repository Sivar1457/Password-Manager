package passwordConvertor;
import java.io.*;
import java.nio.file.*;

public class ProcessBuilderAgePipeExample {
    public static void main(String[] args) throws Exception {
        // Create a temporary named pipe (FIFO)
        Path fifoPath = Paths.get("/tmp/my_fifo_pipe");
        Files.deleteIfExists(fifoPath);
        Process mkfifoProcess = new ProcessBuilder("mkfifo", fifoPath.toString()).inheritIO().start();
        if (mkfifoProcess.waitFor() != 0) {
            throw new RuntimeException("Failed to create FIFO");
        }

        // Start writer thread to write plaintext into the FIFO
        Thread writerThread = new Thread(() -> {
            try (BufferedWriter writer = Files.newBufferedWriter(fifoPath)) {
                writer.write("Secret Message!\nAnother secret line.");
                writer.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
        writerThread.start();

        // Encrypt the FIFO contents using 'age'
        ProcessBuilder pb = new ProcessBuilder(
                "age",
                "-p" // password mode (prompt)
        );
        pb.redirectInput(fifoPath.toFile()); // pipe input
        Process ageProcess = pb.start();

        // Provide password to 'age' via stdin
        try (BufferedWriter ageStdin = new BufferedWriter(new OutputStreamWriter(ageProcess.getOutputStream()))) {
            ageStdin.write("mypassword\n"); // provide password
            ageStdin.flush();
        }

        // Read encrypted output from 'age'
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(ageProcess.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        }

        // Wait for writer and age process
        writerThread.join();
        ageProcess.waitFor();

        // Clean up
        Files.deleteIfExists(fifoPath);
    }
}
